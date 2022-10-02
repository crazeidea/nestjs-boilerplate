import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import { BadRequestException, INestApplication, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let disableKeepAlive = false;

async function bootstrap() {
	const app = await NestFactory.create<INestApplication>(AppModule);

	/**
	 * Enable CORS
	 * @see https://github.com/expressjs/cors
	 */
	app.enableCors();

	/**
	 * Enable Compression
	 * @see https://github.com/expressjs/compression
	 */
	app.use(compression());

	/**
	 * Enable Logging
	 * @see https://github.com/expressjs/morgan
	 */
	app.use(morgan('common'));

	/**
	 * Enable Helmet
	 * @see https://github.com/helmetjs/helmet
	 */
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: [`'self'`],
					styleSrc: [`'self'`, `'unsafe-inline'`],
					imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
					scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
				},
			},
		}),
	);

	/**
	 * Set Global Prefix
	 */
	app.setGlobalPrefix('api');

	/**
	 * Enable Non-Stop Deploy
	 */
	app.use((req, res, next) => {
		if (disableKeepAlive) {
			res.set('Connection', 'close');
		}
		next();
	});
	process.on('SIGINT', async () => {
		disableKeepAlive = true;
		await app.close();
		process.exit(0);
	});

	/**
	 * Enable Global Validation Pipe
	 */
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			exceptionFactory: (errors: ValidationError[]) => {
				if (errors && errors.length > 0) {
					const children = errors[0].children;
					if (children && children.length !== 0) {
						const error = children[0].constraints;
						const keys = Object.keys(error);
						const type = keys[keys.length - 1];
						const message = error[type];
						return new BadRequestException(message);
					}
					const error = errors[0].constraints;
					const keys = Object.keys(error);
					const type = keys[keys.length - 1];
					const message = error[type];
					return new BadRequestException(message);
				}
			},
		}),
	);

	/**
	 * Enable Swagger
	 */
	const config = new DocumentBuilder().setTitle('Nestjs Boilerplate API').setDescription('API for Nestjs Boilerplate API').setVersion('1.0.0').addBearerAuth().build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('document', app, document);

	/**
	 * Get Port from ENV File
	 */
	const configService: ConfigService = app.get(ConfigService);
	const port = configService.get<string>('APP_PORT');

	await app.listen(port || 3000),
		() => {
			new Logger.log(`Server initialized on port ${port || 3000}`);
		};
}
bootstrap();
