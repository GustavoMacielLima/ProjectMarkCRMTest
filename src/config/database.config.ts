import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const config: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || '4Sport',
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV !== 'production',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
};

export default config;
