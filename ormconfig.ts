import { DataSource, DataSourceOptions } from 'typeorm';

let dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/**/migrations/**/*{.ts,.js}'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dataSourceOptions, {
      type: 'sqlite',
      database: 'db.sqlite',
    });
    break;
  case 'test':
    Object.assign(dataSourceOptions, {
      type: 'sqlite',
      database: 'test.sqlite',
    });
    break;
  case 'production':
    Object.assign(dataSourceOptions, {
      type: 'postgres',
      database: 'xxx',
    });
    break;
  default:
    throw new Error(`Unknown environment: ${process.env.NODE_ENV}`);
}

export const AppDataSource = new DataSource(dataSourceOptions);