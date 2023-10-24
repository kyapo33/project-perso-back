import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { SignUpInputDto } from 'auth/dto/inputs/signup.dto';
import { AuthModel } from 'auth/dto/models/auth.model.dto';
import { LoginInputDto } from 'auth/dto/inputs/login.dto';
import { User } from 'user/user.model';
import { encrypt } from 'utils/crypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async doesEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  async calculateAge(birthdate: Date): Promise<number> {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();

    // If the birthdate hasn't occurred this year yet, subtract 1 from the age
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }

  async generateSerialNumber(): Promise<string> {
    const totalUsers = await this.userModel.countDocuments();
    const newSerial = `${process.env.SERIAL_NUMBER_PREFIX}-${(totalUsers + 1).toString().padStart(4, '0')}`;
    return newSerial;
  }

  async signUp(input: SignUpInputDto): Promise<AuthModel> {
    const { email, password, birthdate, phoneNumber } = input;

    if (await this.doesEmailExist(email)) {
      throw new HttpException('Cet utilisateur existe déjà', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const age = birthdate ? await this.calculateAge(new Date(birthdate)) : undefined;

    const cryptPhoneNumber = phoneNumber ? encrypt(phoneNumber) : undefined;

    const serialNumber = encrypt(await this.generateSerialNumber());

    const user = await this.userModel.create({ ...input, password: hashedPassword, age, phoneNumber: cryptPhoneNumber, serialNumber });

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }

  async login(input: LoginInputDto): Promise<AuthModel> {
    const { email, password } = input;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token }
  }
}
