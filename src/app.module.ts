import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentModule } from './environment/environment.module';

@Module({
  imports: [EnvironmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
