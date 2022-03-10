import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';
import Task from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(
    @Query() filterDTO: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${
        user.username
      }" retrieving all tasks...\nFilters applied: ${JSON.stringify(
        filterDTO,
      )}`,
    );
    return this.tasksService.getTasks(filterDTO, user);
  }

  @Get('/:id')
  public getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  public createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${
        user.username
      }" is creating a new Task with the following parameters: ${JSON.stringify(
        createTaskDTO,
      )}`,
    );
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDTO;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  public deleteTask(@Param('id') id: string, @GetUser() user: User): void {
    return this.tasksService.deleteTask(id, user);
  }
}
