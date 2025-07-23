import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
// import { User } from './users/user.entity';
// import { Report } from './reports/report.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');
import { AppDataSource } from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    ReportsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true // this will allow us
          // to remove @Transform decorator on primitive types and Serializable types
        },
        whitelist: true,
        stopAtFirstError: false
      }),
    }
  ],
})
export class AppModule {
  constructor(private configService: ConfigService){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession(
      {
        keys: [this.configService.get<string>('COOKIE_KEY')]
      })).forRoutes('*')
  }
}
