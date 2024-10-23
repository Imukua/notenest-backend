"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    const corsOrigin = configService.get('CORS_ORIGIN', 'https://notenestd.vercel.app/');
    app.enableCors({
        origin: corsOrigin,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const options = {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js'
        ]
    };
    swagger_1.SwaggerModule.setup('api-docs', app, document, options);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map