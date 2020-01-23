import { NestFactory } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';

import { CONFIG } from './config';


async function bootstrap() {
  const development = process.env.NODE_ENV.trim() === 'development';
  const developmentPort = 3000;
  const app = await NestFactory.create(AppModule);

  // Setup CORS
  if (development) {
    // Use this for dev mode because Postman won't work otherwise
    app.use(/.*?\/api\/.*/, cors({origin: '*'}));
  }
  else {
    const whitelist = CONFIG.corsWhitelistProd;
    const corsOptions = {
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        }
        else {
          callback(new NotFoundException('CORS issue'));
        }
      }
    };
    app.use(/.*?\/api\/.*/, cors(corsOptions));
  }

  await app.listen( (development) ? developmentPort : process.env.PORT );
}
bootstrap();
