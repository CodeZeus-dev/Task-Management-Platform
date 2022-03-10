import { TaskStatus } from './tasks/task-status.enum';

export const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

export const mockUser = {
  username: 'Constantine',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

export const mockTask = {
  title: 'Mock Title',
  description: 'Mock Description',
  id: 'Mock ID',
  status: TaskStatus.OPEN,
};
