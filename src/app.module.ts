import { Module } from '@nestjs/common';
import { AppRoutingModule } from './app-routing.module';
import { EnvironmentModule } from './environment/environment.module';

@Module({
	imports: [EnvironmentModule, AppRoutingModule],
})
export class AppModule {}
