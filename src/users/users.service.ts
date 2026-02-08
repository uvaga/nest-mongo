import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRsp, SignupRsp, User } from './interfaces/user';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordHasherService } from './auth/password-hasher/password-hasher.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  // tslint:disable-next-line:no-empty
  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<User>,
    private hasherService: PasswordHasherService,
    private jwtService: JwtService,
  ) {}

  async signup(doc: CreateUserDTO): Promise<SignupRsp> {
    const user = await this.userModel.findOne({ email: doc.email });
    if (user) {
      throw new UnauthorizedException(
        `User already created with this ${doc.email}`,
      );
    }
    const encryptedPassword = await this.hasherService.hashPassword(
      doc.password,
    );
    const newUser = new this.userModel({
      email: doc.email,
      password: encryptedPassword,
    });
    await newUser.save();
    return { email: newUser.email };
  }

  async login(doc: CreateUserDTO): Promise<LoginRsp> {
    // verfiy user email
    const user = await this.userModel.findOne({ email: doc.email });
    if (!user) {
      throw new UnauthorizedException(
        `Could not find any user with this email ${doc.email}`,
      );
    }
    // verify user password
    const matchedPassword = await this.hasherService.comparePassword(
      doc.password,
      user.password,
    );
    if (matchedPassword) {
      // generate JSON web token
      const token = await this.jwtService.signAsync(
        {
          email: user.email,
          id: user._id,
        },
        {
          expiresIn: '1d',
        },
      );
      return { token };
    } else {
      throw new UnauthorizedException(`Invalid password`);
    }
  }

  async validateUserById(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
