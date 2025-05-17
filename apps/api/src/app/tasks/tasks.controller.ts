import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User as AuthUser } from '../types/user';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @RequirePermissions(Permission.TASK_CREATE)
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  @RequirePermissions(Permission.TASK_READ_OWN_LIST)
  findAllOwn(@CurrentUser() user: AuthUser) {
    return this.tasksService.findAllByOwner(user.id);
  }

  @Get('all')
  @RequirePermissions(Permission.TASK_READ_ANY_LIST)
  findAllAdmin() {
    return this.tasksService.findAllAdmin();
  }

  @Get(':id')
  @RequirePermissions(Permission.TASK_READ_OWN_DETAIL)
  findOneOwn(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.tasksService.findOneByOwner(id, user.id);
  }

  @Get('admin/:id')
  @RequirePermissions(Permission.TASK_READ_ANY_DETAIL)
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOneAdmin(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.TASK_UPDATE_OWN)
  updateOwn(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.updateByOwner(id, updateTaskDto, user.id);
  }

  @Patch('admin/:id')
  @RequirePermissions(Permission.TASK_UPDATE_ANY)
  updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateAdmin(id, updateTaskDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.TASK_DELETE_OWN)
  removeOwn(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.tasksService.removeByOwner(id, user.id);
  }

  @Delete('admin/:id')
  @RequirePermissions(Permission.TASK_DELETE_ANY)
  removeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.removeAdmin(id);
  }
}
