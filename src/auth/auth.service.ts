import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('User already exists');
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found...');
    const isPasswordMatched = await verify(user.password, password);
    console.log(isPasswordMatched);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials...');

    return {
      id: user.id,
      username: user.username,
      role: user.role_id,
      email: user.email,
      created_at: user.created_at,
    };
  }

  loginWithUser(user: {
    id: number;
    username: string;
    role: number;
    email: string;
    created_at: Date;
  }) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at.toISOString(),
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user,
    };
  }
}
