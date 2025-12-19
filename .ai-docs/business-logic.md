---
domain: general
title: "Business Logic and Functionality"
description: "Business Logic and Functionality - comprehensive documentation covering overview, application-purpose, core-business-entities, todo-entity, business-features and more."

patterns:
  - overview
  - application-purpose
  - core-business-entities
  - todo-entity
  - business-features
  - 1.-view-todos
  - 2.-create-todo
  - 3.-mark-todo-as-complete
  - 4.-mark-todo-as-incomplete-undo
  - data-persistence
  - storage-mechanism
  - data-integrity
  - user-workflows
  - complete-workflow:-create-and-complete-a-todo
  - error-scenarios
  - network-error
  - invalid-input
  - resource-not-found
  - business-constraints-and-limitations
  - current-limitations
  - scalability-considerations
  - future-feature-possibilities
  - short-term-enhancements
  - medium-term-enhancements
  - long-term-enhancements
  - api-contract
  - base-url
  - endpoints-summary
  - data-models
  - todo-response-model
  - create-todo-request
  - update-todo-request
  - business-metrics
  - key-performance-indicators-kpis
  - success-criteria
  - domain-language-ubiquitous-language

keywords:

sections:
  - name: "Overview"
    line_start: 3
    line_end: 5
    summary: "This document describes the business logic, features, and functionality of the Todo List application..."
  - name: "Application Purpose"
    line_start: 6
    line_end: 8
    summary: "The application allows users to manage their daily tasks through a simple, intuitive todo list inter..."
  - name: "Core Business Entities"
    line_start: 9
    line_end: 28
    summary: "The central business entity of the application."
  - name: "Business Features"
    line_start: 29
    line_end: 114
    summary: "**User Story:** As a user, I want to view all my todos organized by completion status, so I can see ..."
  - name: "Data Persistence"
    line_start: 115
    line_end: 134
    summary: "**Current Implementation:** File-based JSON storage"
  - name: "User Workflows"
    line_start: 135
    line_end: 176
    summary: "1. User opens application"
  - name: "Business Constraints and Limitations"
    line_start: 177
    line_end: 196
    summary: "1. **No Authentication:** Anyone can access and modify todos"
  - name: "Future Feature Possibilities"
    line_start: 197
    line_end: 223
    summary: "1. **Delete Todo:** Remove todos from the system"
  - name: "API Contract"
    line_start: 224
    line_end: 266
    summary: "{"
  - name: "Business Metrics"
    line_start: 267
    line_end: 284
    summary: "While not currently tracked, these metrics would be valuable:"
  - name: "Domain Language (Ubiquitous Language)"
    line_start: 285
    line_end: 296
    summary: "Content about Domain Language (Ubiquitous Language)"

complexity: intermediate
line_count: 296
last_updated: 2025-12-19

related:
---

# Business Logic and Functionality

## Overview
This document describes the business logic, features, and functionality of the Todo List application. The application is a full-stack todo management system with a React frontend and NestJS backend.

## Application Purpose
The application allows users to manage their daily tasks through a simple, intuitive todo list interface. Users can create todos with descriptions, mark them as complete, and view them in organized columns.

## Core Business Entities

### Todo Entity
The central business entity of the application.

**Properties:**
- `id` (string): Unique identifier for the todo (timestamp-based)
- `title` (string): The main text of the todo item (required)
- `description` (string, optional): Additional details about the todo
- `done` (boolean): Completion status of the todo
- `createdAt` (string): ISO timestamp of when the todo was created
- `completedDate` (string, optional): ISO timestamp of when the todo was marked as complete

**Business Rules:**
1. Every todo must have a non-empty title
2. A todo cannot have a `completedDate` unless `done` is `true`
3. When a todo is marked as incomplete, the `completedDate` should be cleared
4. IDs are generated using `Date.now().toString()` for simplicity
5. Timestamps use ISO 8601 format for consistency

## Business Features

### 1. View Todos
**User Story:** As a user, I want to view all my todos organized by completion status, so I can see what needs to be done and what's already complete.

**Functionality:**
- Todos are displayed in two columns: "To Do" and "Done"
- Each column shows a count of items
- Todos are fetched from the backend on application load
- Empty states are shown when no todos exist in a column

**Business Rules:**
- Incomplete todos (`done: false`) appear in the "To Do" column
- Complete todos (`done: true`) appear in the "Done" column
- Todos are displayed in the order they're returned from the backend

**API Endpoint:** `GET /todos`
- Returns: Array of all todo objects
- Status: 200 OK

### 2. Create Todo
**User Story:** As a user, I want to create new todos with a title and optional description, so I can track tasks I need to complete.

**Functionality:**
- User clicks "+ Add New Todo" button to open a modal
- User enters a title (required) and description (optional)
- User submits the form to create the todo
- Modal closes and new todo appears in the "To Do" column

**Business Rules:**
- Title must not be empty or whitespace-only
- Description is optional
- New todos are always created with `done: false`
- `createdAt` is set to current timestamp
- `id` is generated server-side
- Modal can be closed via Cancel button, X button, Escape key, or clicking backdrop

**API Endpoint:** `POST /todos`
- Request Body: `{ title: string, description?: string }`
- Returns: Created todo object
- Status: 201 Created (or 200 OK currently)

**Validation:**
- Title required and non-empty
- Description optional, any string value

### 3. Mark Todo as Complete
**User Story:** As a user, I want to mark todos as complete, so I can track my progress and move finished items to the "Done" column.

**Functionality:**
- User clicks "Mark Done" button on a todo in the "To Do" column
- Todo is immediately updated and moved to the "Done" column
- Completion timestamp is recorded

**Business Rules:**
- Only incomplete todos can be marked as complete
- `done` is set to `true`
- `completedDate` is set to current ISO timestamp
- Todo remains in the system (not deleted)

**API Endpoint:** `PATCH /todos/:id`
- URL Parameter: `id` (string)
- Request Body: `{ done: true }`
- Returns: Updated todo object
- Status: 200 OK

### 4. Mark Todo as Incomplete (Undo)
**User Story:** As a user, I want to undo completion of a todo, so I can move it back to my active list if I completed it by mistake.

**Functionality:**
- User clicks "Undo" button on a todo in the "Done" column
- Todo is immediately updated and moved back to the "To Do" column
- Completion timestamp is cleared

**Business Rules:**
- Only complete todos can be marked as incomplete
- `done` is set to `false`
- `completedDate` is cleared (`undefined`)
- Original `createdAt` remains unchanged

**API Endpoint:** `PATCH /todos/:id`
- URL Parameter: `id` (string)
- Request Body: `{ done: false }`
- Returns: Updated todo object
- Status: 200 OK

## Data Persistence

### Storage Mechanism
**Current Implementation:** File-based JSON storage
- Todos are persisted to `backend/data/todos.json`
- File is created automatically if it doesn't exist
- Data is stored as a JSON array of todo objects
- Formatted with 2-space indentation for readability

**Business Rules:**
- Data directory is created if it doesn't exist
- If todos.json doesn't exist or is corrupted, return empty array
- All write operations are atomic (read, modify, write)
- No locking mechanism (suitable for single-user, low-concurrency scenarios)

### Data Integrity
- No duplicate IDs (guaranteed by timestamp-based generation)
- No referential integrity constraints (single entity system)
- No soft deletes (currently no delete functionality)

## User Workflows

### Complete Workflow: Create and Complete a Todo
1. User opens application
2. Application fetches and displays existing todos
3. User clicks "+ Add New Todo"
4. Modal opens with form
5. User enters "Buy groceries" as title
6. User enters "Milk, eggs, bread" as description
7. User clicks "Add Todo" button
8. Modal closes
9. New todo appears in "To Do" column with "Buy groceries" title
10. User completes the task in real life
11. User clicks "Mark Done" button on the todo
12. Todo moves to "Done" column
13. Completion timestamp is recorded

### Error Scenarios

#### Network Error
**Scenario:** Backend is unavailable when fetching todos
- **Expected Behavior:** Error logged to console, empty todos array displayed
- **User Experience:** Application shows empty state

**Scenario:** Network fails during todo creation
- **Expected Behavior:** Error logged, modal remains open, form data preserved
- **User Experience:** User can retry submission

#### Invalid Input
**Scenario:** User submits empty title
- **Expected Behavior:** Form validation prevents submission (client-side)
- **User Experience:** Submit button has no effect

**Scenario:** Backend receives invalid data (if client validation bypassed)
- **Expected Behavior:** Backend returns 400 Bad Request (when validation is implemented)
- **Current Behavior:** Todo created with empty title (no validation yet)

#### Resource Not Found
**Scenario:** User tries to update a non-existent todo
- **Expected Behavior:** Backend returns 404 Not Found with error message
- **Current Behavior:** Backend throws generic error

## Business Constraints and Limitations

### Current Limitations
1. **No Authentication:** Anyone can access and modify todos
2. **No Multi-User Support:** All users share the same todo list
3. **No Delete Functionality:** Todos cannot be deleted once created
4. **No Edit Functionality:** Todo title and description cannot be edited after creation
5. **No Sorting/Filtering:** Todos displayed in default order only
6. **No Search:** Cannot search or filter todos by text
7. **No Categories/Tags:** Cannot organize todos into categories
8. **No Priority Levels:** All todos have equal priority
9. **No Due Dates:** Cannot set deadlines for todos
10. **No Pagination:** All todos loaded at once (performance issue with large lists)

### Scalability Considerations
- File-based storage suitable for <1000 todos
- Single JSON file becomes bottleneck with many concurrent users
- No caching mechanism (each request reads from file)
- No backup or recovery mechanism

## Future Feature Possibilities

### Short-term Enhancements
1. **Delete Todo:** Remove todos from the system
2. **Edit Todo:** Update title and description
3. **Input Validation:** Enforce business rules on client and server
4. **Error Handling:** Display user-friendly error messages
5. **Loading States:** Show spinners during API calls

### Medium-term Enhancements
1. **Due Dates:** Add deadline tracking
2. **Priority Levels:** Mark todos as high, medium, or low priority
3. **Categories/Tags:** Organize todos into groups
4. **Search and Filter:** Find specific todos
5. **Sorting Options:** Sort by date, priority, or alphabetically
6. **Pagination:** Load todos in chunks

### Long-term Enhancements
1. **User Authentication:** Personal todo lists per user
2. **Database Integration:** Replace file storage with PostgreSQL/MongoDB
3. **Real-time Updates:** WebSocket support for multi-device sync
4. **Recurring Todos:** Repeat tasks daily, weekly, etc.
5. **Subtasks:** Break down todos into smaller steps
6. **Attachments:** Add files or images to todos
7. **Reminders:** Notification system for upcoming deadlines
8. **Collaboration:** Share todos with other users

## API Contract

### Base URL
- Development: `http://localhost:3000`
- Production: TBD

### Endpoints Summary

| Method | Endpoint      | Description           | Auth Required |
|--------|---------------|-----------------------|---------------|
| GET    | /todos        | List all todos        | No            |
| POST   | /todos        | Create new todo       | No            |
| PATCH  | /todos/:id    | Update todo status    | No            |

### Data Models

#### Todo Response Model
```json
{
  "id": "1702345678901",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "done": false,
  "createdAt": "2024-12-18T10:30:00.000Z",
  "completedDate": null
}
```

#### Create Todo Request
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

#### Update Todo Request
```json
{
  "done": true
}
```

## Business Metrics

### Key Performance Indicators (KPIs)
While not currently tracked, these metrics would be valuable:

1. **Total Todos Created:** Track user engagement
2. **Completion Rate:** Percentage of todos marked as done
3. **Average Time to Completion:** Time between creation and completion
4. **Active Users:** Number of unique users (when auth is added)
5. **Todos per User:** Average number of todos per user
6. **Abandonment Rate:** Percentage of todos never completed

### Success Criteria
- Users can create todos in <5 seconds
- UI responds to actions in <200ms
- No data loss during normal operations
- Application available 99.9% uptime (when deployed)

## Domain Language (Ubiquitous Language)

- **Todo:** A task or item that needs to be completed
- **Complete/Done:** A todo that has been finished
- **Incomplete/Pending:** A todo that has not been finished yet
- **Mark as Done:** Action of completing a todo
- **Undo:** Action of reverting a completed todo back to incomplete status
- **Title:** The main text describing what needs to be done
- **Description:** Additional details about the todo
- **Created At:** The moment when the todo was added to the system
- **Completed Date:** The moment when the todo was marked as done
