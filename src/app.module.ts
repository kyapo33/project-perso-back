import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { FamilyModule } from 'family/family.module';
import { NotificationModule } from 'notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_SERVER ?? ''),
    TerminusModule,
    AuthModule,
    UserModule,
    FamilyModule,
    NotificationModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule { }
