import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This runs after the token is successfully verified
  async validate(payload: any) {
    // Return 'sub' to match the payload and standard JWT practices
    return { 
      sub: payload.sub, // <-- This is the key fix
      email: payload.email, 
      role: payload.role 
    };
  }
}