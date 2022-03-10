import { Test } from '@nestjs/testing';
import TasksRepository from './tasks.repository';
import { TasksService } from './tasks.service';
import { mockTasksRepository, mockUser, mockTask } from '../mockObjects';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // Initialise a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository }, // mocking TasksRepository and resolving dependency of TasksService on it
      ],
    }).compile(); // needs to be compiled to use the module

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the found tasks', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue('someValue'); // Resolved due to the Promise return value
      const result = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findTaskById, with id and user, and returns the found task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const randomId = '1';
      const result = await tasksService.getTaskById(randomId, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findTaskById, with id and user, and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      const randomId = '1';
      expect(tasksService.getTaskById(randomId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
