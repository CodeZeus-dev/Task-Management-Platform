import { Injectable, NotFoundException } from '@nestjs/common';
import Task from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import TasksRepository from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  public getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask: Task = await this.tasksRepository.findOne({
      where: { id, user },
    });
    if (!foundTask) {
      // could also use || // user.tasks.filter((task) => task.id === foundTask.id).length === 0
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return foundTask;
  }

  public createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  public deleteTask(id: string, user: User): void {
    this.tasksRepository.deleteTask(id, user);
  }

  public updateTaskStatus(
    id: string,
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    return this.tasksRepository.updateTask(id, newStatus, user);
  }
}
