# Scratch Memory: add-todo-modal-details

## Domain Concepts
<!-- Business logic, terminology, domain rules -->

### Todo Data Model
- Todo items have: title (content), status (pending/in_progress/completed), activeForm
- Todos represent tasks in a task management system
- Status represents the lifecycle state of a todo item

### User Interaction Flow
- User views a list of todos
- Clicking on a todo opens a modal overlay with detailed information
- Modal is view-only (read-only presentation of todo data)
- Modal can be dismissed via: close button, backdrop click, or ESC key

## Technical Patterns
<!-- Architectural patterns, code structures found -->

### Modal Component Pattern (App.jsx:6-71)
- **Structure**: Functional component with conditional rendering (`if (!isModalOpen) return null`)
- **Props API**: Receives 5 props (isModalOpen, form state, setters, submit handler)
- **Dismissal Logic**:
  - Backdrop click: checks `e.target.className === 'modal-backdrop'` (line 21)
  - ESC key: useEffect with event listener cleanup (lines 26-34)
  - Close button: onClick handler (line 41)
- **State Management**: Parent component owns state, modal receives setters
- **Auto-focus**: First input gets `autoFocus` prop (line 50)
- **Form Handling**: Prevents empty submission with title validation (line 11)

### Component Architecture
- **Pattern**: Single-file component with inline sub-components
- **File**: /home/alex/code/claude-playground/plugins/frontend/src/App.jsx
- **Structure**: Modal component (lines 6-71), App component (lines 73-186)
- **State Location**: All state in App component (lines 74-76)
  - `todos`: array from API
  - `isModalOpen`: boolean for modal visibility
  - `todoForm`: object with title and description fields

### React Patterns Used
- **Hooks**: useState (line 74-76), useEffect (lines 26-34, 78-80)
- **Event Handlers**: Inline arrow functions for simple callbacks
- **Async Operations**: async/await with try-catch blocks
- **List Rendering**: .map() with key prop (lines 157, 172)
- **Conditional Rendering**: Ternary and && operators
- **State Updates**: Spread operator for immutability

### Styling Architecture (App.css)
- **Single CSS file**: All styles in one file (342 lines)
- **Modal Styles**: Lines 174-342
- **Animation**: CSS keyframe `modalFadeIn` (lines 198-207)
- **Layout**: CSS Grid for two-column layout (line 72-75)
- **Responsive**: Media query at 768px breakpoint (lines 160-172)
- **Design System**: Consistent colors (#667eea primary, #764ba2 accent)

## Integration Points
<!-- How systems connect, dependencies, interfaces -->

### Todo Item Rendering (App.jsx)
- **Location**: Lines 157-164 (pending todos), Lines 172-179 (completed todos)
- **Current Structure**:
  ```jsx
  <div key={todo.id} className="todo-item">
    <span>{todo.title}</span>
    <button>Mark Done / Undo</button>
  </div>
  ```
- **Integration Point**: Need to add onClick to the entire `.todo-item` div or the `<span>`
- **Current Click Handler**: Only on buttons for status toggle (lines 160, 175)

### State Management Integration
- **Todos State**: Line 74 - `const [todos, setTodos] = useState([]);`
- **Proposed New State** (for detail modal):
  - `isDetailModalOpen`: boolean flag
  - `selectedTodo`: object or null - stores the clicked todo
- **Location**: Add after line 76 in App.jsx

### API Data Structure (Backend)
- **Interface**: /home/alex/code/claude-playground/plugins/backend/src/todos/todo.interface.ts
- **Available Fields**:
  - `id`: string (timestamp-based)
  - `title`: string (required)
  - `description`: string | undefined (optional)
  - `done`: boolean
  - `createdAt`: string (ISO 8601)
  - `completedDate`: string | undefined (set when done=true)
- **Gap**: Description and timestamps are NOT currently displayed in UI

### CSS Styling Integration
- **Existing Modal Styles**: Lines 174-342 in App.css
- **Reusable Classes**:
  - `.modal-backdrop`, `.modal-container`, `.modal-header`, `.close-button`
- **New Classes Needed**: Detail-specific content styling (labels, value display)
- **Pattern**: Can extend existing modal styles or add new classes

## Gotchas & Constraints
<!-- Limitations, things to watch out for, edge cases -->

### Modal UX Requirements
- Must support multiple dismissal methods for good UX (close button, backdrop, ESC)
- Modal should be accessible (keyboard navigation, screen readers)
- Must prevent body scroll when modal is open

### Event Bubbling Concern (App.jsx:157-164)
- **Issue**: Todo items have buttons inside them
- **Risk**: If we add onClick to `.todo-item`, clicking the "Mark Done" button will trigger BOTH handlers
- **Solution**: Must use `e.stopPropagation()` on button clicks OR check `e.target` in item click handler
- **Found**: Lines 160, 175 - existing button handlers don't stop propagation

### Optional Fields Handling
- **Issue**: `description`, `completedDate` are optional (undefined possible)
- **Display Logic**: Must handle undefined gracefully
  - Show "No description" or hide section if description is undefined
  - Only show completedDate when todo.done === true
- **Found**: todo.interface.ts lines 4, 7

### Date Formatting
- **Issue**: Timestamps are ISO 8601 strings (e.g., "2024-01-15T10:30:00.000Z")
- **Display**: Need to format for human readability
- **Options**:
  - Use `new Date(isoString).toLocaleString()`
  - Use date library (if available)
  - Show relative time ("2 hours ago")
- **No date library detected**: Must use native JavaScript Date methods

### Status Display
- **Issue**: Backend uses `done` boolean, but requirements ask for "status"
- **Mapping**:
  - done: false → "Pending" or "To Do"
  - done: true → "Completed" or "Done"
- **Note**: Backend doesn't track "in_progress" state (only done/not done)

### Cursor Styling
- **UX**: Todo items should show pointer cursor to indicate clickability
- **Current**: .todo-item has hover effect but no cursor style in App.css
- **Need**: Add `cursor: pointer` to `.todo-item` or to a new `.todo-item.clickable` class

## Decisions & Rationale
<!-- Why choices were made, alternatives considered -->

### View-Only Modal (Phase 1)
- Decision: Modal will be view-only, not editable
- Rationale: Keeps initial implementation simple and focused
- Alternative considered: Inline editing (rejected for complexity)
- Alternative considered: Edit button to separate form (rejected for scope)

### Multiple Dismissal Options
- Decision: Support close button (X), backdrop click, and ESC key
- Rationale: Provides flexible UX that matches user expectations across different interaction patterns

### Use Existing UI Library
- Decision: Leverage existing modal component from project's UI library
- Rationale: Faster implementation, consistent styling, already tested
- Alternative considered: Custom modal (rejected - reinventing the wheel)
- Alternative considered: Native dialog element (rejected - prefer existing patterns)

## Assumptions
<!-- Things assumed during planning that need validation -->

- Project has an existing UI library with a modal component
- Todo items are currently displayed in a list/table format that can be made clickable
- Todo data structure includes timestamps (created/updated) - needs verification in Phase 2
- Application state management can handle modal open/close state

## Questions & Unknowns
<!-- Open items, areas needing future consideration -->

- Where are todo items currently rendered in the codebase?
- What UI library/framework is being used?
- How is todo data currently structured (exact schema)?
- Are timestamps already tracked for todos?

## Reusable Solutions
<!-- Patterns/approaches applicable to other features -->

### Modal Pattern for Detail Views
- Click-to-view-details pattern can be reused for other list items
- Modal dismissal handling (backdrop, ESC, close button) is a standard pattern
- View-only modal pattern useful for any "quick view" features
