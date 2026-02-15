import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { User, SignupRsp, LoginRsp } from './interfaces/user';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles-guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('signup')
  async signUp(@Body() user: CreateUserDTO): Promise<SignupRsp> {
    return await this.userService.signup(user);
  }

  @Post('login')
  async login(@Body() user: CreateUserDTO): Promise<LoginRsp> {
    return await this.userService.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RolesGuard)
  async profile(@Request() req: any) {
    return req.user;
  }
}
