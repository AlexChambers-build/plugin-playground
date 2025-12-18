import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Todo } from './todo.interface';

@Injectable()
export class TodosService {
  private readonly dataPath = join(process.cwd(), 'data', 'todos.json');

  async getTodos(): Promise<Todo[]> {
    try {
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async createTodo(title: string, description?: string): Promise<Todo> {
    const todos = await this.getTodos();
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      done: false,
      createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    await this.saveTodos(todos);
    return newTodo;
  }

  async updateTodo(id: string, done: boolean): Promise<Todo> {
    const todos = await this.getTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.done = done;
    todo.completedDate = done ? new Date().toISOString() : undefined;
    await this.saveTodos(todos);
    return todo;
  }

  private async saveTodos(todos: Todo[]): Promise<void> {
    await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
    await fs.writeFile(this.dataPath, JSON.stringify(todos, null, 2));
  }
}
