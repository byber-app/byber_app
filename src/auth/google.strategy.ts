import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {

  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    })
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user = {
      name: profile.name.givenName,
      surname: profile.name.familyName,
      email: profile.emails[0].value,
      password: profile.id,
      profile_photo: profile.photos[0].value,
    };
    done(null, user);
    console.log(user);

  }
}
