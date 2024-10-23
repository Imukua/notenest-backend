import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT', 3000); // Default to 3000 if not set
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*'); // Default to all origins if not set

  console.log('Configured CORS Origin:', corsOrigin);

  // Swagger setup
  const config = new DocumentBuilder()
  .setTitle('NoteNest API')
  .setDescription(`
    NoteNest is a powerful note-taking application that allows users to create, manage, and organize their notes efficiently.

    Key features:
    - User authentication (register, login, logout)
    - CRUD operations for journal entries
    - Categorization and filtering of journal entries
    - User profile management

    This API provides endpoints for all these features. For a more detailed explanation of each endpoint, please refer to the individual route descriptions below.

    To interact with the API through a user-friendly interface, visit our web application:
    [NoteNest Web UI](https://notenestd.vercel.app/)
  `)
  .setVersion('1.0')
  .addTag('auth', 'Authentication related endpoints')
  .addTag('journals', 'Journal entry management endpoints')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Vercel can't properly serve the Swagger UI CSS from its npm package, here we
  // load it from a public location
  const options = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js'
    ]
  };
  
  SwaggerModule.setup('api-docs', app, document, options);

  app.enableCors({
    origin: (origin, callback) => {
      console.log('Incoming request from origin:', origin);
      if (!origin || corsOrigin === '*') {
        callback(null, true);
        return;
      }
      const allowedOrigins = corsOrigin.split(',');
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Origin not allowed:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.use((req, res, next) => {
    console.log('Request:', {
      method: req.method,
      path: req.path,
      origin: req.get('origin'),
      headers: req.headers,
    });
    next();
  });

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
