import 'reflect-metadata';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config({ path: '.env.test' });

// Configurar timezone para testes
process.env.TZ = 'UTC';
