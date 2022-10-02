import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { EnvironmentService } from './environment.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: path.join(__dirname, '..', `.env.${process.env.NODE_ENV}`),
			isGlobal: true,
		}),
	],
	providers: [EnvironmentService],
})
export class EnvironmentModule implements OnModuleInit {
	/**
	 * ENV 파일 존재 여부를 확인합니다.
	 * @author 최강훈 <ganghun@lepisode.team>
	 * @since 1.0.0
	 */
	onModuleInit() {
		const envFilePath = path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`);

		try {
			fs.readFileSync(envFilePath);
		} catch (e) {
			throw new Error('ENV 파일을 찾을 수 없습니다.');
		}
	}
}
