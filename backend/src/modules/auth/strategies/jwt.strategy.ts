import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { extractAccessTokenFromCookie } from '../auth.helpers';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    const secretOrKey = configService.get<string>('JWT_ACCESS_SECRET');

    if (!secretOrKey) {
      throw new Error('Missing JWT_ACCESS_SECRET. Add it to backend/.env.');
    }

    super({
      jwtFromRequest: extractAccessTokenFromCookie,
      ignoreExpiration: false,
      secretOrKey
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user || user.isBlocked) {
      throw new UnauthorizedException('User is not authorized.');
    }

    return user;
  }
}
