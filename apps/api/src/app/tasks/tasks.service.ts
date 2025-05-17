import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../types/user'; // User type from auth

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
      status: createTaskDto.status || TaskStatus.PENDING,
    });
    return this.tasksRepository.save(task);
  }

  async findAllByOwner(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({ where: { userId } });
  }

  async findAllAdmin(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findOneByOwner(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found or not owned by user.`);
    }
    return task;
  }

  async findOneAdmin(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    return task;
  }

  async updateByOwner(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOneByOwner(id, userId); // Ensures ownership and existence
    this.tasksRepository.merge(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async updateAdmin(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneAdmin(id); // Ensures existence
    this.tasksRepository.merge(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async removeByOwner(id: string, userId: string): Promise<void> {
    const task = await this.findOneByOwner(id, userId); // Ensures ownership and existence
    await this.tasksRepository.remove(task);
  }

  async removeAdmin(id: string): Promise<void> {
    const task = await this.findOneAdmin(id); // Ensures existence
    await this.tasksRepository.remove(task);
  }
}
