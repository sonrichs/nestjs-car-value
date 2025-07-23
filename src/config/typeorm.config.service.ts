import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    switch (process.env.NODE_ENV) {
      case 'test':
        return {
          type: 'sqlite',
          synchronize: true,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: true,
        };
      case 'development':
        return {
          type: 'sqlite',
          synchronize: false,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: false,
        };
      case 'production':
        return {
          type: 'postgres',
          synchronize: false,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: false,
        };
      default:
        throw new Error(`Unknown environment: ${process.env.NODE_ENV}`);
    }
  }
}