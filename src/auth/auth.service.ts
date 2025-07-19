import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async signup(email: string, password: string) {
    const existingUser = await this.usersService.find(email);
    if (existingUser && existingUser.length) {
      throw new BadRequestException('User already exists');
    }

    // Has the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt togeteher
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const newUser = await this.usersService.create(email, result);

    // return the user
    return newUser;
  }

  async signin(email: string, password: string) {
    const [existingUser] = await this.usersService.find(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = existingUser.password.split('.');
    
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash){
      throw new UnauthorizedException('Bad password');
    }

    return existingUser;
  }
}
