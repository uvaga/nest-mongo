import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constants';
import { PasswordHasherService } from './auth/password-hasher/password-hasher.service';

@Module({
  imports: [
    JwtModule.register({ secret: jwtConstants.secret }),
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordHasherService],
})
export class UsersModule {}
