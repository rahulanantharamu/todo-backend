import {
  createTodo,
  getTodoById,
  listTodos,
  updateTodo,
  deleteTodo,
} from "../services/todoService";

function mapStatusInput(
  status?: string
): "pending" | "in-progress" | "done" | undefined {
  if (!status) return undefined;
  switch (status) {
    case "PENDING":
      return "pending";
    case "IN_PROGRESS":
      return "in-progress";
    case "DONE":
      return "done";
    default:
      return undefined;
  }
}

function mapStatusOutput(status: string): "PENDING" | "IN_PROGRESS" | "DONE" {
  switch (status) {
    case "pending":
      return "PENDING";
    case "in-progress":
      return "IN_PROGRESS";
    case "done":
      return "DONE";
    default:
      return "PENDING";
  }
}

export const todoResolvers = {
  Query: {
    todo: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const todo = await getTodoById(context.userId, id);
      return todo ? { ...todo, status: mapStatusOutput(todo.status) } : null;
    },
    todos: async (
      _: any,
      { page, limit, search, status }: any,
      context: any
    ) => {
      if (!context.userId) throw new Error("Not authenticated");
      const dbStatus = mapStatusInput(status); 
      const result = await listTodos(context.userId, {
        page,
        limit,
        search,
        status: dbStatus,
      });
      return {
        ...result,
        items: result.items.map((t) => ({
          ...t,
          status: mapStatusOutput(t.status),
        })),
      };
    },
  },
  Mutation: {
    createTodo: async (_: any, { input }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const todo = await createTodo(context.userId, {
        ...input,
        status: mapStatusInput(input.status),
      });
      return { ...todo, status: mapStatusOutput(todo.status) };
    },
    updateTodo: async (_: any, { id, input }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const todo = await updateTodo(context.userId, id, {
        ...input,
        status: mapStatusInput(input.status),
      });
      return { ...todo, status: mapStatusOutput(todo.status) };
    },
    deleteTodo: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await deleteTodo(context.userId, id);
    },
  },
};
