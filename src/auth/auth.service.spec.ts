import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password
        } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }
      ]
    }).compile();

    authService = module.get(AuthService);
  })

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup('test@test.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await authService.signup('test@test.com', 'asdf');
    await expect(authService.signup('test@test.com', 'asdf')).rejects.toThrow(BadRequestException);
  });

  it('throws an error if no user is found when calling signin', async () => {
    await expect(authService.signin('test@test.com', 'asdf')).rejects.toThrow(NotFoundException)
  })

  it('throws if an invalid password is provided', async () => {
    await authService.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      authService.signin('laskdjf@alskdfj.com', 'incorrectpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('returns a user if email and password are correct', async () => {
    await authService.signup('asdf@asdf.com', 'mypassword');
    const user = await authService.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  })
})
