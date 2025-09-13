import { UserInputError } from "apollo-server-express";

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new UserInputError("Invalid email format");
  }
}

export function validatePassword(password: string): void {
  if (!password || password.length < 6) {
    throw new UserInputError("Password must be at least 6 characters long");
  }
}

export function validateTodoInput(input: {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}): void {
  if (!input.title || input.title.trim() === "") {
    throw new UserInputError("title is required");
  }

  if (input.status) {
    const validStatuses = ["pending", "in-progress", "done"];
    if (!validStatuses.includes(input.status)) {
      throw new UserInputError(
        "Invalid status. Allowed values: pending, in-progress, done"
      );
    }
  }

  if (input.dueDate && isNaN(Date.parse(input.dueDate))) {
    throw new UserInputError("Invalid due date format");
  }
}

export function validateUpdateTodoInput(input: {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}): void {
  if (input.title !== undefined && input.title.trim() === "") {
    throw new UserInputError("title cannot be empty");
  }

  if (input.status) {
    const validStatuses = ["pending", "in-progress", "done"];
    if (!validStatuses.includes(input.status)) {
      throw new UserInputError(
        "Invalid status. Allowed values: pending, in-progress, done"
      );
    }
  }

  if (input.dueDate && isNaN(Date.parse(input.dueDate))) {
    throw new UserInputError("Invalid due date format");
  }
}
