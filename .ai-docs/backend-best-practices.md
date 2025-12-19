---
domain: general
title: "Backend Best Practices"
description: "Backend Best Practices - comprehensive documentation covering overview, technology-stack, architecture-principles, clean-architecture-layers, hexagonal-architecture-ports-&-adapters and more."

patterns:
  - overview
  - technology-stack
  - architecture-principles
  - clean-architecture-layers
  - hexagonal-architecture-ports-&-adapters
  - directory-structure
  - current-structure
  - recommended-structure-for-scaling
  - naming-conventions
  - files-and-folders
  - classes-and-interfaces
  - variables-and-methods
  - module-design-single-responsibility
  - module-structure
  - module-principles
  - dependency-injection
  - constructor-injection-preferred
  - dependency-inversion
  - service-layer-best-practices
  - single-responsibility
  - error-handling
  - async/await-best-practices
  - controller-layer-best-practices
  - restful-api-design
  - http-status-codes
  - input-validation-with-dtos
  - separation-of-concerns
  - data-access-layer
  - repository
  - domain-entities
  - exception-filters
  - domain-exceptions
  - testing-considerations
  - unit-testing-services
  - integration-testing-controllers
  - configuration-management
  - environment-variables
  - security-best-practices
  - input-validation
  - cors-configuration
  - rate-limiting
  - logging
  - structured-logging
  - performance-optimization
  - caching
  - git-and-version-control
  - commit-messages
  - key-principles-summary

keywords:

sections:
  - name: "Overview"
    line_start: 3
    line_end: 5
    summary: "This document outlines best practices for the NestJS backend application, adhering to Clean Architec..."
  - name: "Technology Stack"
    line_start: 6
    line_end: 11
    summary: "Content about Technology Stack"
  - name: "Architecture Principles"
    line_start: 12
    line_end: 42
    summary: "The application follows Clean Architecture with these layers (from innermost to outermost):"
  - name: "Directory Structure"
    line_start: 43
    line_end: 99
    summary: "backend/"
  - name: "Naming Conventions"
    line_start: 100
    line_end: 129
    summary: "Content about Naming Conventions"
  - name: "Module Design (Single Responsibility)"
    line_start: 130
    line_end: 150
    summary: "Each module should represent a single bounded context or feature:"
  - name: "Dependency Injection"
    line_start: 151
    line_end: 185
    summary: "@Injectable()"
  - name: "Service Layer Best Practices"
    line_start: 186
    line_end: 253
    summary: "Each service should handle one business capability:"
  - name: "Controller Layer Best Practices"
    line_start: 254
    line_end: 364
    summary: "Follow REST conventions:"
  - name: "Data Access Layer"
    line_start: 365
    line_end: 444
    summary: "Implement repositories for data access:"
  - name: "Error Handling"
    line_start: 445
    line_end: 487
    summary: "Create custom exception filters for consistent error responses:"
  - name: "Testing Considerations"
    line_start: 488
    line_end: 543
    summary: "describe('TodosService', () => {"
  - name: "Configuration Management"
    line_start: 544
    line_end: 573
    summary: "Use `@nestjs/config` for configuration:"
  - name: "Security Best Practices"
    line_start: 574
    line_end: 609
    summary: "async function bootstrap() {"
  - name: "Logging"
    line_start: 610
    line_end: 635
    summary: "Use NestJS Logger:"
  - name: "Performance Optimization"
    line_start: 636
    line_end: 664
    summary: "Use cache manager for performance:"
  - name: "Git and Version Control"
    line_start: 665
    line_end: 677
    summary: "Use conventional commits:"
  - name: "Key Principles Summary"
    line_start: 678
    line_end: 696
    summary: "1. **SOLID Principles**"

complexity: intermediate
line_count: 696
last_updated: 2025-12-19

related:
---

# Backend Best Practices

## Overview
This document outlines best practices for the NestJS backend application, adhering to Clean Architecture and Hexagonal Architecture principles. The backend follows a modular, domain-driven structure with clear separation of concerns.

## Technology Stack
- **Framework**: NestJS 11.1.9
- **Runtime**: Node.js with TypeScript 5.9.3
- **Language**: TypeScript
- **Architecture**: Clean Architecture + Hexagonal Architecture patterns

## Architecture Principles

### Clean Architecture Layers
The application follows Clean Architecture with these layers (from innermost to outermost):

1. **Domain Layer** (Entities/Interfaces)
   - Business entities and value objects
   - Domain interfaces
   - Pure business logic, framework-agnostic

2. **Application Layer** (Use Cases/Services)
   - Application business rules
   - Orchestrates domain objects
   - Implements use cases

3. **Infrastructure Layer** (Adapters/Repositories)
   - External dependencies
   - Database access
   - File system operations
   - Third-party services

4. **Presentation Layer** (Controllers)
   - HTTP endpoints
   - Request/response handling
   - Input validation

### Hexagonal Architecture (Ports & Adapters)
- **Ports**: Interfaces that define contracts
- **Adapters**: Implementations of ports (controllers, repositories)
- **Core**: Business logic isolated from external concerns

## Directory Structure

### Current Structure
```
backend/
├── src/
│   ├── todos/
│   │   ├── todo.interface.ts      # Domain entity
│   │   ├── todos.service.ts       # Application service (use case)
│   │   ├── todos.controller.ts    # Presentation adapter
│   │   └── todos.module.ts        # Module definition
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Application entry point
├── data/                          # Data persistence (filesystem)
└── dist/                          # Compiled output
```

### Recommended Structure for Scaling

```
src/
├── modules/                       # Feature modules
│   ├── todos/
│   │   ├── domain/               # Domain layer
│   │   │   ├── entities/         # Domain entities
│   │   │   │   └── todo.entity.ts
│   │   │   ├── value-objects/    # Value objects
│   │   │   └── interfaces/       # Domain interfaces/ports
│   │   │       ├── todo-repository.interface.ts
│   │   │       └── todo.interface.ts
│   │   ├── application/          # Application layer
│   │   │   ├── services/         # Application services
│   │   │   │   └── todos.service.ts
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── create-todo.dto.ts
│   │   │   │   └── update-todo.dto.ts
│   │   │   └── use-cases/        # Use case implementations (optional)
│   │   ├── infrastructure/       # Infrastructure layer
│   │   │   ├── persistence/      # Data access adapters
│   │   │   │   ├── todo.repository.ts
│   │   │   │   └── file-todo.repository.ts
│   │   │   └── mappers/          # Data mappers
│   │   ├── presentation/         # Presentation layer
│   │   │   └── controllers/
│   │   │       └── todos.controller.ts
│   │   └── todos.module.ts       # Module definition
│   └── users/                    # Other feature modules
├── shared/                        # Shared code
│   ├── domain/                   # Shared domain concepts
│   ├── infrastructure/           # Shared infrastructure
│   │   ├── database/
│   │   └── config/
│   └── filters/                  # Exception filters
├── app.module.ts
└── main.ts
```

## Naming Conventions

### Files and Folders
- **Modules**: kebab-case with `.module.ts` suffix (e.g., `todos.module.ts`)
- **Controllers**: kebab-case with `.controller.ts` suffix (e.g., `todos.controller.ts`)
- **Services**: kebab-case with `.service.ts` suffix (e.g., `todos.service.ts`)
- **Interfaces**: kebab-case with `.interface.ts` suffix (e.g., `todo.interface.ts`)
- **DTOs**: kebab-case with `.dto.ts` suffix (e.g., `create-todo.dto.ts`)
- **Entities**: kebab-case with `.entity.ts` suffix (e.g., `todo.entity.ts`)
- **Repositories**: kebab-case with `.repository.ts` suffix (e.g., `todo.repository.ts`)
- **Folders**: kebab-case, plural for collections (e.g., `todos/`, `users/`)

### Classes and Interfaces
- **Classes**: PascalCase with descriptive suffix
  - Controllers: `TodosController`
  - Services: `TodosService`
  - Repositories: `TodoRepository`
  - DTOs: `CreateTodoDto`, `UpdateTodoDto`
  - Entities: `Todo`, `User`

- **Interfaces**: PascalCase, often with `I` prefix for ports
  - Domain interfaces: `Todo` (no prefix for domain models)
  - Port interfaces: `ITodoRepository`, `IEmailService`

### Variables and Methods
- **Variables**: camelCase (e.g., `dataPath`, `newTodo`)
- **Methods**: camelCase, verb-based (e.g., `getTodos`, `createTodo`, `saveTodos`)
- **Private members**: Prefix with `private` keyword (e.g., `private readonly dataPath`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `DEFAULT_PAGE_SIZE`)

## Module Design (Single Responsibility)

### Module Structure
Each module should represent a single bounded context or feature:

```typescript
@Module({
  imports: [],        // Module dependencies
  controllers: [],    // Presentation layer
  providers: [],      // Services, repositories
  exports: [],        // Exposed services for other modules
})
export class TodosModule {}
```

### Module Principles
1. **Self-contained**: Each module should be independently deployable (conceptually)
2. **Single Purpose**: One module = one business capability
3. **Explicit Dependencies**: Use imports to declare dependencies
4. **Minimal Exports**: Only export what other modules need

## Dependency Injection

### Constructor Injection (Preferred)
```typescript
@Injectable()
export class TodosService {
  constructor(
    private readonly todoRepository: ITodoRepository,
    private readonly logger: Logger,
  ) {}
}
```

### Dependency Inversion Principle
Depend on abstractions, not concretions:

```typescript
// GOOD: Depend on interface
export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  save(todo: Todo): Promise<Todo>;
}

@Injectable()
export class TodosService {
  constructor(private readonly repository: ITodoRepository) {}
}

// Provider configuration
{
  provide: 'ITodoRepository',
  useClass: FileTodoRepository, // or DatabaseTodoRepository
}
```

## Service Layer Best Practices

### Single Responsibility
Each service should handle one business capability:

```typescript
// GOOD: Focused service
@Injectable()
export class TodosService {
  async getTodos(): Promise<Todo[]> { }
  async createTodo(data: CreateTodoDto): Promise<Todo> { }
  async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo> { }
}

// BAD: Service doing too much
@Injectable()
export class AppService {
  async getTodos() { }
  async getUsers() { }
  async sendEmail() { }
}
```

### Error Handling
Use NestJS built-in exceptions:

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class TodosService {
  async updateTodo(id: string, done: boolean): Promise<Todo> {
    const todos = await this.getTodos();
    const todo = todos.find((t) => t.id === id);
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    if (typeof done !== 'boolean') {
      throw new BadRequestException('Done must be a boolean value');
    }
    
    todo.done = done;
    await this.saveTodos(todos);
    return todo;
  }
}
```

### Async/Await Best Practices
- Always use async/await for asynchronous operations
- Handle errors appropriately
- Return promises with proper types

```typescript
// GOOD
async getTodos(): Promise<Todo[]> {
  try {
    const data = await this.repository.findAll();
    return data;
  } catch (error) {
    this.logger.error('Failed to fetch todos', error);
    throw new InternalServerErrorException('Failed to fetch todos');
  }
}
```

## Controller Layer Best Practices

### RESTful API Design
Follow REST conventions:

```typescript
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()                    // GET /todos
  async findAll(): Promise<Todo[]> { }

  @Get(':id')               // GET /todos/:id
  async findOne(@Param('id') id: string): Promise<Todo> { }

  @Post()                   // POST /todos
  async create(@Body() dto: CreateTodoDto): Promise<Todo> { }

  @Put(':id')               // PUT /todos/:id
  async update(@Param('id') id: string, @Body() dto: UpdateTodoDto): Promise<Todo> { }

  @Patch(':id')             // PATCH /todos/:id
  async partialUpdate(@Param('id') id: string, @Body() dto: Partial<UpdateTodoDto>): Promise<Todo> { }

  @Delete(':id')            // DELETE /todos/:id
  async remove(@Param('id') id: string): Promise<void> { }
}
```

### HTTP Status Codes
Use appropriate status codes:
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
async create(@Body() dto: CreateTodoDto): Promise<Todo> {
  return this.todosService.createTodo(dto);
}
```

### Input Validation with DTOs
Use class-validator for input validation:

```typescript
import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTodoDto {
  @IsBoolean()
  done: boolean;
}
```

Enable validation in main.ts:
```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

### Separation of Concerns
Controllers should be thin - delegate business logic to services:

```typescript
// GOOD: Thin controller
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todosService.createTodo(dto);
  }
}

// BAD: Fat controller with business logic
@Controller('todos')
export class TodosController {
  @Post()
  async create(@Body() dto: CreateTodoDto): Promise<Todo> {
    const todo = {
      id: Date.now().toString(),
      title: dto.title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    // ... business logic in controller (BAD!)
  }
}
```

## Data Access Layer

### Repository Pattern
Implement repositories for data access:

```typescript
// Port (interface)
export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(todo: Todo): Promise<Todo>;
  update(id: string, todo: Partial<Todo>): Promise<Todo>;
  delete(id: string): Promise<void>;
}

// Adapter (implementation)
@Injectable()
export class FileTodoRepository implements ITodoRepository {
  private readonly dataPath = join(process.cwd(), 'data', 'todos.json');

  async findAll(): Promise<Todo[]> {
    try {
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async create(todo: Todo): Promise<Todo> {
    const todos = await this.findAll();
    todos.push(todo);
    await this.save(todos);
    return todo;
  }

  private async save(todos: Todo[]): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(todos, null, 2));
  }
}
```

### Domain Entities
Keep entities pure and framework-agnostic:

```typescript
// GOOD: Pure domain entity
export interface Todo {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  completedDate?: string;
}

// Or as a class with business logic
export class Todo {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | undefined,
    public done: boolean,
    public readonly createdAt: Date,
    public completedDate?: Date,
  ) {}

  markAsComplete(): void {
    this.done = true;
    this.completedDate = new Date();
  }

  markAsIncomplete(): void {
    this.done = false;
    this.completedDate = undefined;
  }
}
```

## Error Handling

### Exception Filters
Create custom exception filters for consistent error responses:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### Domain Exceptions
Create domain-specific exceptions:

```typescript
export class TodoNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Todo with ID ${id} not found`);
  }
}

export class InvalidTodoException extends BadRequestException {
  constructor(message: string) {
    super(`Invalid todo: ${message}`);
  }
}
```

## Testing Considerations

### Unit Testing Services
```typescript
describe('TodosService', () => {
  let service: TodosService;
  let repository: MockType<ITodoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: 'ITodoRepository',
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get('ITodoRepository');
  });

  it('should create a todo', async () => {
    const dto = { title: 'Test', description: 'Test desc' };
    repository.create.mockResolvedValue({ id: '1', ...dto, done: false });

    const result = await service.createTodo(dto);
    expect(result.title).toBe('Test');
  });
});
```

### Integration Testing Controllers
```typescript
describe('TodosController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todos (GET)', () => {
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
```

## Configuration Management

### Environment Variables
Use `@nestjs/config` for configuration:

```typescript
// .env
DATABASE_URL=postgresql://localhost:5432/mydb
PORT=3000
NODE_ENV=development

// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
})
export class AppModule {}

// Using configuration
constructor(private configService: ConfigService) {
  const port = this.configService.get<number>('PORT');
}
```

## Security Best Practices

### Input Validation
- Always validate input using DTOs
- Use class-validator decorators
- Enable global validation pipe

### CORS Configuration
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    credentials: true,
  });
  await app.listen(3000);
}
```

### Rate Limiting
Use throttler for rate limiting:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
export class AppModule {}
```

## Logging

### Structured Logging
Use NestJS Logger:

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  async getTodos(): Promise<Todo[]> {
    this.logger.log('Fetching all todos');
    try {
      const todos = await this.repository.findAll();
      this.logger.debug(`Found ${todos.length} todos`);
      return todos;
    } catch (error) {
      this.logger.error('Failed to fetch todos', error.stack);
      throw error;
    }
  }
}
```

## Performance Optimization

### Caching
Use cache manager for performance:

```typescript
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}

// In service
@Injectable()
export class TodosService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getTodos(): Promise<Todo[]> {
    const cached = await this.cacheManager.get<Todo[]>('todos');
    if (cached) return cached;

    const todos = await this.repository.findAll();
    await this.cacheManager.set('todos', todos, 300); // 5 minutes
    return todos;
  }
}
```

## Git and Version Control

### Commit Messages
Use conventional commits:

```
feat(todos): add todo completion tracking
fix(todos): handle missing todo in update endpoint
refactor(todos): extract repository pattern
perf(todos): add caching for todo list
test(todos): add unit tests for service
```

## Key Principles Summary

1. **SOLID Principles**
   - **S**ingle Responsibility: One class, one reason to change
   - **O**pen/Closed: Open for extension, closed for modification
   - **L**iskov Substitution: Subtypes must be substitutable
   - **I**nterface Segregation: Many specific interfaces over one general
   - **D**ependency Inversion: Depend on abstractions, not concretions

2. **Clean Architecture**: Separate concerns into layers with clear dependencies

3. **Hexagonal Architecture**: Isolate business logic from external concerns

4. **KISS**: Keep implementations simple and straightforward

5. **YAGNI**: Don't add complexity until it's needed

6. **DRY**: Extract common logic, but don't over-abstract
