import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
	@ApiProperty({
		description: 'Título de la tarea',
		example: 'Actualizar informe trimestral',
		required: false,
	})
	@IsString()
	@IsOptional()
	@MaxLength(255)
	title?: string;

	@ApiProperty({
		description: 'Descripción detallada de la tarea',
		example: 'Actualizar las métricas del último trimestre',
		required: false,
	})
	@IsString()
	@IsOptional()
	@MaxLength(1000)
	description?: string;

	@ApiProperty({
		description: 'Estado de la tarea',
		enum: TaskStatus,
		example: TaskStatus.IN_PROGRESS,
		required: false,
	})
	@IsEnum(TaskStatus)
	@IsOptional()
	status?: TaskStatus;
}
