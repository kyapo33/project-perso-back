import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { FamilySchema } from 'family/family.model';
import { UserController } from 'user/user.controller';
import { UserSchema } from 'user/user.model';
import { UserService } from 'user/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Family', schema: FamilySchema }]),
        AuthModule,
        CloudinaryModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [
        UserService
    ]
})
export class UserModule { }
