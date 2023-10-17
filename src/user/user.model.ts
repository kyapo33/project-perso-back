import { ApiProperty } from '@nestjs/swagger';
import { Schema, Document, Model, ObjectId } from 'mongoose';
import { GetUserProfileByFamilyDto } from 'user/dto/models/get-user-profile-by-family';
import { v2 as cloudinary } from 'cloudinary';

export interface UserModel extends Model<User> {
    findWithFamilyId(userId: string, familyId: string): Promise<GetUserProfileByFamilyDto>;
    findMultipleWithFamilyId(familyId: string): Promise<GetUserProfileByFamilyDto[]>;
}

export class UserName {
    @ApiProperty({ description: 'UserName value' })
    value!: string;

    @ApiProperty({ description: 'Family ID' })
    familyId!: ObjectId;
}

export class User extends Document {
    @ApiProperty({ description: 'User Name By Family' })
    userName?: UserName[];

    @ApiProperty({ description: 'User Email' })
    email!: string;

    @ApiProperty({ description: 'User Password' })
    password!: string;

    @ApiProperty({ description: 'User Families' })
    familyIds?: string[];

    @ApiProperty({ description: 'User First Name' })
    firstName!: string;

    @ApiProperty({ description: 'User Last Name' })
    lastName!: string;

    @ApiProperty({ description: 'User Phone Number' })
    phoneNumber?: string;

    @ApiProperty({ description: 'User Birthdate', type: Date, required: false })
    birthdate?: Date;

    @ApiProperty({ description: 'User Age', type: Number })
    age?: number;

    @ApiProperty({ description: 'User Serial Number' })
    serialNumber!: string;

    @ApiProperty({ description: 'User profile picture id', required: false })
    profilePictureId?: string;
}

const UserNameSchema = new Schema({
    value: { type: String, required: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true }
});

export const UserSchema = new Schema({
    userName: {
        type: [UserNameSchema],
        required: false,
        default: undefined
    },
    email: { type: String, unique: true, required: true },
    serialNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobileToken: { type: String, required: false },
    familyIds: [{ type: Schema.Types.ObjectId, ref: 'Family', required: false }],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    birthdate: { type: Date, required: false },
    age: {
        type: Number,
        required: false,
    },
    profilePictureId: { type: String, required: false },
});

UserSchema.statics.findWithFamilyId = async function (userId: string, familyId: string) {
    const doc = await this.findById(userId).lean().exec() as User;

    return {
        ...doc,
        id: doc._id.toString(),
        userName: doc.userName?.find((uName: UserName) => uName.familyId.toString() === familyId)?.value ?? undefined,
        profilePictureUrl: doc.profilePictureId ? cloudinary.url(doc.profilePictureId) : undefined
    }
};

UserSchema.statics.findMultipleWithFamilyId = async function (familyId: string) {
    const docs = await this.find({ familyIds: familyId }).lean().exec();

    const newDocs = await Promise.all(docs.map((doc: User) => ({
        ...doc,
        id: doc._id.toString(),
        userName: doc.userName?.find(uName => uName.familyId.toString() === familyId)?.value ?? undefined,
        profilePictureUrl: doc.profilePictureId ? cloudinary.url(doc.profilePictureId) : undefined
    })))

    return newDocs;
};

UserSchema.virtual('profilePictureUrl').get(function () {
    if (this.profilePictureId) {
        return cloudinary.url(this.profilePictureId);
    }
    return undefined;
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });