import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

const routes: Routes = [];

@Module({
	imports: [RouterModule.register(routes), PrismaModule],
	exports: [RouterModule],
	providers: [PrismaService],
})
export class AppRoutingModule {}
