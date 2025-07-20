import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => Promise.resolve({ id, email: 'some@email.com', password: 'password' } as User),
      find: (email: string) => Promise.resolve([{ id: 1, email, password: 'password' } as User]),
      // remove: () => {},
      // update: () => {}
    };
    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  })

  it('findUser throws an error if no user is found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  })

  it('signin updates session and returns the signed in user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session
    )
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })

  it('signup updates session and returns the signed up user', async () => {
    const session = { userId: -10 };
    const user = await controller.createUser(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session
    )
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
