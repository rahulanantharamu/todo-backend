import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';
import { Todo, User } from '../models';
import { validateTodoInput, validateUpdateTodoInput } from '../utils/validation';

type TodoInput = {
  title: string;
  description?: string;
  dueDate?: string | Date | null;
  status?: 'pending' | 'in-progress' | 'done';
};

type ListFilters = {
  status?: 'pending' | 'in-progress' | 'done';
  search?: string;
  page?: number;
  limit?: number;
};

export const createTodo = async (userId: number, payload: TodoInput) => {
  if (!userId) throw new AuthenticationError('Missing user authentication');

  // Run validations
  validateTodoInput({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    dueDate: payload.dueDate ? String(payload.dueDate) : undefined,
  });

  const user = await User.findByPk(userId);
  if (!user) throw new AuthenticationError('User not found');

  const todo = await Todo.create({
    title: payload.title.trim(),
    description: payload.description ?? null,
    dueDate: payload.dueDate ?? null,
    status: payload.status ?? 'pending',
    userId,
  });

  return todo.toJSON();
};

export const getTodoById = async (userId: number, todoId: number) => {
  if (!userId) throw new AuthenticationError('Missing user authentication');

  const todo = await Todo.findOne({ where: { id: todoId, userId } });
  if (!todo) return null;

  return todo.toJSON();
};

export const listTodos = async (
  userId: number,
  filters: ListFilters = {}
) => {
  if (!userId) throw new AuthenticationError('Missing user authentication');

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, Math.min(100, filters.limit ?? 10));
  const offset = (page - 1) * limit;

  const where: any = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    const q = `%${filters.search.trim()}%`;
    where[Op.or] = [
      { title: { [Op.iLike]: q } },
      { description: { [Op.iLike]: q } },
    ];
  }

  const { rows, count } = await Todo.findAndCountAll({
    where,
    limit,
    offset,
    order: [['id', 'DESC']],
  });

  const todos = rows.map((r: any) => r.toJSON());

  return {
    items: todos,
    total: count,
    page,
    limit,
  };
};

export const updateTodo = async (
  userId: number,
  todoId: number,
  payload: Partial<TodoInput>
) => {
  if (!userId) throw new AuthenticationError('Missing user authentication');

  // Run validations
  validateUpdateTodoInput({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    dueDate: payload.dueDate ? String(payload.dueDate) : undefined,
  });

  const todo = await Todo.findOne({ where: { id: todoId, userId } });
  if (!todo) throw new UserInputError('Todo not found');

  const updates: any = {};
  if (payload.title !== undefined) updates.title = payload.title.trim();
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.dueDate !== undefined) updates.dueDate = payload.dueDate;
  if (payload.status !== undefined) updates.status = payload.status;

  await todo.update(updates);
  return todo.toJSON();
};

export const deleteTodo = async (userId: number, todoId: number) => {
  if (!userId) throw new AuthenticationError('Missing user authentication');

  const todo = await Todo.findOne({ where: { id: todoId, userId } });
  if (!todo) throw new UserInputError('Todo not found');

  await todo.destroy();
  return { success: true, message: 'Todo deleted' };
};

export default {
  createTodo,
  getTodoById,
  listTodos,
  updateTodo,
  deleteTodo,
};
