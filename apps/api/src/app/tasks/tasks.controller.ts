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

  // Get tasks for the authenticated user
  @Get()
  @RequirePermissions(Permission.TASK_READ_OWN_LIST)
  findAllOwn(@CurrentUser() user: AuthUser) {
    return this.tasksService.findAllByOwner(user.id);
  }

  // Admin route to get all tasks
  @Get('all')
  @RequirePermissions(Permission.TASK_READ_ANY_LIST)
  findAllAdmin() {
    return this.tasksService.findAllAdmin();
  }

  // Get a specific task owned by the authenticated user
  @Get(':id')
  @RequirePermissions(Permission.TASK_READ_OWN_DETAIL)
  findOneOwn(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.tasksService.findOneByOwner(id, user.id);
  }

  // Admin route to get any specific task
  @Get('admin/:id')
  @RequirePermissions(Permission.TASK_READ_ANY_DETAIL)
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOneAdmin(id);
  }

  // Update a specific task owned by the authenticated user
  @Patch(':id')
  @RequirePermissions(Permission.TASK_UPDATE_OWN)
  updateOwn(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.updateByOwner(id, updateTaskDto, user.id);
  }

  // Admin route to update any specific task
  @Patch('admin/:id')
  @RequirePermissions(Permission.TASK_UPDATE_ANY)
  updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateAdmin(id, updateTaskDto);
  }

  // Delete a specific task owned by the authenticated user
  @Delete(':id')
  @RequirePermissions(Permission.TASK_DELETE_OWN)
  removeOwn(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.tasksService.removeByOwner(id, user.id);
  }

  // Admin route to delete any specific task
  @Delete('admin/:id')
  @RequirePermissions(Permission.TASK_DELETE_ANY)
  removeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.removeAdmin(id);
  }
}
