import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

const routes: Routes = [];

@Module({
	imports: [RouterModule.register(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
