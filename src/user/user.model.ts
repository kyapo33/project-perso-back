import { ApiProperty } from '@nestjs/swagger';
import { Schema, Document, Model, ObjectId } from 'mongoose';
import { GetUserProfileByFamilyDto } from 'user/dto/models/get-user-profile-by-family';

export interface UserModel extends Model<User> {
    findWithFamilyId(userId: string, familyId: string): Promise<GetUserProfileByFamilyDto>;
    findMultipleWithFamilyId(familyId: string): Promise<GetUserProfileByFamilyDto[]>;
}

export class UserName {
    @ApiProperty({ description: 'UserName value' })
    value!: string;

    @ApiProperty({ description: 'Family ID' })
    familyId!: string;
}

export class User extends Document {
    @ApiProperty({ description: 'User Name By Family', type: [UserName] })
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

    @ApiProperty({ description: 'User Birthdate', type: Date })
    birthdate?: Date;

    @ApiProperty({ description: 'User Age', type: Number })
    age?: number;

    @ApiProperty({ description: 'User Serial Number' })
    serialNumber!: string;
}

const UserNameSchema = new Schema({
    value: { type: String, required: true },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true }
});

export const UserSchema = new Schema({
    userName: [UserNameSchema],
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
    }
});

UserSchema.statics.findWithFamilyId = async function (userId: string, familyId: string) {
    const doc = await this.findById(userId).lean().exec();

    return {
        ...doc,
        id: doc._id.toString(),
        userName: doc.userName?.find((uName: UserName) => uName.familyId.toString() === familyId)?.value ?? undefined
    }
};

UserSchema.statics.findMultipleWithFamilyId = async function (familyId: string) {
    const docs = await this.find({ familyIds: familyId }).lean().exec();

    const newDocs = await Promise.all(docs.map((doc: { userName: UserName[], _id: Schema.Types.ObjectId }) => ({
        ...doc,
        id: doc._id.toString(),
        userName: doc.userName?.find(uName => uName.familyId.toString() === familyId)?.value ?? undefined
    })))

    return newDocs;
};