import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RequirePermissions } from './auth/decorators/permissions.decorator';
import { Permission } from './auth/enums/permission.enum';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@RequirePermissions(Permission.ARTICLE_READ_ALL)
	getData() {
		return this.appService.getData();
	}
}
