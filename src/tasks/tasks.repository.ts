import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import Task from './task.entity';

@EntityRepository(Task)
export default class TasksRepository extends Repository<Task> {
  public async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task'); // 'task' dictates how I can refer to a task in the query
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search', // LIKE => partial match
        { search: `%${search}%` }, // %% => not perfect match but instead, independent
      );
    }
    const tasks: Task[] = await query.getMany();
    return tasks;
  }

  public async findTaskById(id: string): Promise<Task> {
    const foundTask: Task = await this.findOne(id);
    if (!foundTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return foundTask;
  }

  public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  public async deleteTask(id: string): Promise<void> {
    const deletedTask = await this.delete(id);
    if (deletedTask.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  public async updateTask(id: string, newStatus: TaskStatus): Promise<Task> {
    const task = await this.findTaskById(id);
    task.status = newStatus;
    await this.save(task);
    return task;
  }
}
