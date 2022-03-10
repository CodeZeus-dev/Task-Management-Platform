import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import Task from './task.entity';

@EntityRepository(Task)
export default class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });
  public async getTasks(
    filterDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task'); // 'task' dictates how I can refer to a task in the query
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', // LIKE => partial match
        { search: `%${search}%` }, // %% => not perfect match but instead, independent
      );
    }
    try {
      const tasks: Task[] = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve tasks for user "${
          user.username
        }". Filters applied: ${JSON.stringify(filterDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  public async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }

  public async deleteTask(id: string, user: User): Promise<void> {
    const deletedTask = await this.delete({ id, user });
    if (deletedTask.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  public async updateTask(
    id: string,
    newStatus: TaskStatus,
    user,
  ): Promise<Task> {
    const task = await this.findOne({ where: { id, user } });
    task.status = newStatus;
    await this.save(task);
    return task;
  }
}
