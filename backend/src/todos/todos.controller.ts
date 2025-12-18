import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.interface';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos(): Promise<Todo[]> {
    return this.todosService.getTodos();
  }

  @Post()
  async createTodo(
    @Body('title') title: string,
    @Body('description') description?: string,
  ): Promise<Todo> {
    return this.todosService.createTodo(title, description);
  }

  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body('done') done: boolean,
  ): Promise<Todo> {
    return this.todosService.updateTodo(id, done);
  }
}
