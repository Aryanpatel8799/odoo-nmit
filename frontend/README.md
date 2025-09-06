# SynergySphere Frontend

A modern, responsive React application for team collaboration and project management built with TypeScript, Tailwind CSS, and smooth animations.

## ✨ Features

Proactive UX patterns: notifications, optimistic updates, and lightweight offline support.

Clean component architecture that is easy to extend.

Tech Stack
Framework: React 18 + TypeScript + Vite

Routing: React Router

Styling: Tailwind CSS + CSS variables for theming

State: React Query (server cache) + Zustand (UI/app state) + Context for auth

Forms & Validation: React Hook Form + Zod

Dates: date-fns

Realtime: socket.io-client (for discussions and notifications)

PWA: Workbox service worker (precaching + runtime caching)

Storage: IndexedDB via idb for offline cache/outbox

Testing: Vitest + React Testing Library + Cypress (e2e)

Lint/Format: ESLint + Prettier

Mocks: MSW (Mock Service Worker) with seeded data

Core Features & Acceptance Criteria
Authentication
Users can register with email and password, and login/logout.

“Forgot Password” UI is present (mocked for MVP).

Acceptance:

Login form validates email format and password length.

Displays inline error messages and disables submit while pending.

Persists session token in memory and refreshes on page load if valid.

Projects
Users can see a list of projects they belong to.

Users can create new projects and view project details.

Acceptance:

Project list shows name and summary stats (task counts and completion %).

Create Project modal validates required fields and shows success toast.

Project detail page loads tasks and discussions for that project.

Team Members
Project owners can add members by email.

Members list shows name, email, and role.

Acceptance:

Add Member modal validates email format.

Role defaults to member; owner can be designated by the project creator.

Error shown if user already in project.

Tasks
Users can create tasks with title, description, assignee, due date, and status.

Statuses: To-Do, In Progress, Done.

Acceptance:

Task list or basic Kanban shows title, assignee avatar/initials, and due date.

Create/Edit Task form validates required fields and the due date is not in the past (warning).

Drag and drop between columns (MVP optional; if not, allow inline status change).

Optimistic status update on change, with rollback on failure.

Discussions (Threaded)
Project-level threaded discussions with replies.

Acceptance:

Users can create a new thread with title and message.

Users can reply inline and see nested replies in chronological order.

Realtime: new threads and replies appear via WebSocket subscription.

Unread badge on Project Discussions tab if new activity.

Progress Visualization
Project dashboard shows a progress bar and counts for To-Do, In Progress, Done.

Acceptance:

Progress % = Done / (Total tasks or 1 to avoid division by zero).

Displays completion percentage and color-codes states.

Notifications
In-app toasts and a notifications panel for important events:

Assigned a task

Task status changed

New message in a followed thread

Acceptance:

Unread count badge on bell icon.

Click notification navigates to related resource.

WebSocket updates push new notifications in real time.

Mobile Responsiveness
All pages adapt to small screens with bottom nav and large tap targets.

Acceptance:

No horizontal scroll on mobile.

Interactive elements ≥ 44px touch size.

Critical flows are ≤ 3 taps from project list.

UI Information Architecture
Global Layout
Header: App logo (brand), search (MVP optional), notifications bell, user avatar menu.

Sidebar (desktop): Projects, Dashboard, Discussions, Settings.

Bottom Tab Bar (mobile): Projects, Tasks, Discussions, Profile.

Screens
Auth

Login

Sign Up

Forgot Password (mocked)

Project List/Dashboard

List of user’s projects

Create Project button

Summary stats per project

Project Detail

Tabs: Tasks, Discussions, Overview

Overview: progress bar, counts, recent activity

Tasks

List view or 3-column board (To-Do, In Progress, Done)

Task item shows title, assignee, due date, status chip

Task Detail: edit title, description, assignee, due date, status

Task Create/Edit Modal

Title, description, assignee (autocomplete), due date picker, status

Discussions

Thread list: title, author, last activity, replies count

Thread detail: original post + replies, editor for new reply

Profile/Settings

Name, email

Notification toggles (email/push mock)

Logout

Roles & Permissions (MVP)
Owner:

Add/remove members, change roles

Edit/delete any task/thread

Member:

Create/edit own tasks and threads

Update task status if assigned or if project allows collaborative edit

Non-member:

No access

Data Models (Frontend Types)
ts
type ID = string;

type User = {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
};

type AuthSession = {
  user: User;
  token: string;
  expiresAt: number;
};

type ProjectRole = 'owner' | 'member';

type ProjectMember = {
  userId: ID;
  role: ProjectRole;
};

type Project = {
  id: ID;
  name: string;
  description?: string;
  ownerId: ID;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};

type TaskStatus = 'todo' | 'in_progress' | 'done';

type Task = {
  id: ID;
  projectId: ID;
  title: string;
  description?: string;
  assigneeId?: ID;
  dueDate?: string; // ISO
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

type Thread = {
  id: ID;
  projectId: ID;
  title: string;
  authorId: ID;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
};

type Reply = {
  id: ID;
  threadId: ID;
  authorId: ID;
  body: string;
  createdAt: string;
};

type NotificationType = 'task_assigned' | 'task_status_changed' | 'thread_new' | 'reply_new';

type Notification = {
  id: ID;
  userId: ID;
  type: NotificationType;
  payload: Record<string, unknown>;
  createdAt: string;
  read: boolean;
};
API Contract (Mock for MVP)
Auth

POST /auth/register { email, password, name } -> { user, token }

POST /auth/login { email, password } -> { user, token }

POST /auth/logout -> 204

Projects

GET /projects -> Project[]

POST /projects { name, description? } -> Project

GET /projects/:projectId -> Project

POST /projects/:projectId/members { email, role? } -> Project (updated)

Tasks

GET /projects/:projectId/tasks -> Task[]

POST /projects/:projectId/tasks { title, description?, assigneeId?, dueDate?, status } -> Task

PATCH /tasks/:taskId { title?, description?, assigneeId?, dueDate?, status? } -> Task

DELETE /tasks/:taskId -> 204

Discussions

GET /projects/:projectId/threads -> Thread[]

POST /projects/:projectId/threads { title, body } -> Thread

GET /threads/:threadId/replies -> Reply[]

POST /threads/:threadId/replies { body } -> Reply

Notifications

GET /notifications -> Notification[]

PATCH /notifications/:id { read } -> Notification

Example: Create Task

json
{
  "title": "Implement login form",
  "description": "Build the UI and wire to API",
  "assigneeId": "u_123",
  "dueDate": "2025-09-15T00:00:00.000Z",
  "status": "todo"
}
WebSocket Events (socket.io-client)
Namespace: /realtime

Auth: connect with token in query or auth header

Events emitted by server:

project:thread_created { projectId, thread }

thread:reply_created { threadId, reply }

task:assigned { task, assigneeId }

task:status_changed { taskId, status }

notification:new { notification }

Client behavior:

Subscribe based on joined project rooms.

Update lists via React Query invalidate or manual cache update.

Show toast and increment unread badge.

UX Details
Forms: Debounced validation, disabled submit while pending, inline errors.

Loading: Skeletons for project list, task board, thread list.

Empty States: Friendly prompts with “Create” CTAs.

Errors: Toast and inline retry; optimistic updates with rollback on failure.

Dates: Localized formatting, overdue tasks show red badge.

Avatars: Render initials if no avatarUrl.

Accessibility
Semantic HTML with ARIA labels for menus, dialogs, and tabs.

Keyboard: Tab order, Enter to submit, Esc to close modals, Space/Enter for toggles.

Contrast: Meet WCAG AA with Tailwind color tokens.

Focus: Visible focus rings and focus trap in modals.

Performance
Code splitting per route.

Virtualize long lists (MVP optional; enable when >100 items).

Memoize expensive components and selectors.

Cache task lists per project with React Query.

Offline & PWA
Installable PWA (manifest, icons).

Service Worker with:

Stale-while-revalidate for GET /projects, /tasks, /threads.

Network-only for mutations; queue in IndexedDB outbox when offline and replay on reconnect for create/edit task/thread.

Visual banner when offline; grey out actions requiring network (except queued creates).

Theming
Light/Dark theme toggles via CSS variables and Tailwind.

Persist theme in localStorage.

Navigation & Routing
Public routes: /login, /signup, /forgot

Protected routes: /projects, /projects/:id, /projects/:id/tasks, /projects/:id/discussions, /settings

Redirect to /login if unauthenticated; preserve intended route.

Folder Structure
text
src/
  app/
    main.tsx
    router.tsx
    providers/
      QueryProvider.tsx
      AuthProvider.tsx
      ThemeProvider.tsx
      SocketProvider.tsx
  components/
    common/ (Button, Input, Modal, Select, Avatar, Badge, DatePicker, Tabs, Toast)
    layout/ (Header, Sidebar, BottomNav, Page, Container)
    charts/ (ProgressBar)
  features/
    auth/ (pages: Login, Signup, Forgot; hooks; forms; api)
    projects/ (list, create modal, detail layout)
    tasks/ (board, list, item, detail modal, forms, api)
    discussions/ (thread list, thread detail, editor, api)
    notifications/ (panel, bell, api)
    settings/ (profile page)
  hooks/
  lib/ (apiClient, socket, storage, date, validators)
  store/ (zustand slices for UI; auth context types)
  styles/ (globals.css, tailwind.css)
  assets/
  mocks/ (msw handlers, seeds, server)
  tests/
public/
  manifest.json
  icons/
Environment Variables
Create .env (local dev):

bash
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000/realtime
VITE_APP_NAME=SynergySphere
Scripts
bash
# install
npm install

# develop
npm run dev

# build
npm run build

# preview build
npm run preview

# lint & format
npm run lint
npm run format

# unit tests
npm run test

# e2e tests (run after dev server starts)
npm run e2e
Mock Server (MSW)
Start MSW in dev. Handlers emulate all endpoints from API Contract.

Seed users, 2–3 projects with 10–15 tasks, and a few threads/replies.

Simulate latency (200–600ms) and random error rate (~5%) to exercise error states.

Provide a fake token in login/register response; store in memory and localStorage.

Component Specifications (Key)
Button: sizes (sm, md), variants (primary, secondary, ghost), loading state.

Input: label, error, helper text, left/right icon.

Modal: accessible dialog with focus trap, close on overlay click and Esc.

DatePicker: input with calendar popover, minDate = today for due date by default.

Avatar: image with fallback initials from user.name.

Toast: stacked notifications, auto-dismiss and manual close.

Task Board Behavior
List mode by default (mobile-first); optional board view on desktop.

Status change via dropdown on card and in detail modal.

Sort by due date ascending; overdue pinned on top with red indicator.

Filter bar: assignee (multi), status, due date range (MVP at least status filter).

Discussions Behavior
Infinite scroll for replies (page in 20 chunks).

Editor: autosize textarea, Ctrl/Cmd+Enter to submit.

Mention parsing (MVP optional; display plain text).

Unread tracking per thread (client-side store keyed by threadId + timestamp).

Notifications Behavior
Bell shows unread count; panel lists notifications grouped by date.

Clicking marks as read and routes to target (task or thread).

Realtime insert via socket event; show toast for new important events.

Validation Rules (Zod)
Email: valid format.

Password: min 8 chars.

Project name: 2–60 chars.

Task title: 2–120 chars.

Due date: not before today (warn if within last 24h; allow override after confirm).

Thread title: 2–120 chars.

Reply body: 1–2,000 chars.

Error States
401: redirect to login, show “session expired”.

403: show “insufficient permissions”.

404: show “resource not found” with Back to project.

500: retry with exponential backoff; show banner.

Offline: queue mutations and show “will sync when online” badge.

Testing Checklist
Unit: components render, form validators work, utilities (date, storage).

Integration: auth flow, create/edit task, add member, create thread & reply.

E2E:

User can sign up, create project, add member, create tasks, change status, see progress.

User can create discussion thread and post reply; second client sees it via socket.

Notifications appear when assigned a task and on new replies.

Mobile viewport layout has bottom nav and accessible tap targets.

Coding Standards
Type-safe everywhere, no any unless justified.

Prefer composition over props drilling; colocate feature logic.

Keep components <300 lines; extract subcomponents.

Use React Query for server state; Zustand for view/UI state.

Use optimistic updates for task status and replies; rollback on error.

Definitions of Done (MVP)
All acceptance criteria above pass with MSW.

Lighthouse performance ≥ 85 on mobile for key routes.

No console errors/warnings in dev or production build.

Works offline for reading cached data and queues task/thread creates.

Responsive and accessible (keyboard + screen reader) across screens.

Quick Start for Developers
bash
npm install
npm run dev
# open http://localhost:5173
# Login with seeded user: user@example.com / password123 (MSW)
Seed Data (Example MSW)
json
{
  "users": [
    { "id": "u_1", "name": "Alex Rivera", "email": "user@example.com" }
  ],
  "projects": [
    { "id": "p_1", "name": "Website Redesign", "ownerId": "u_1" }
  ],
  "tasks": [
    { "id": "t_1", "projectId": "p_1", "title": "Set up auth", "status": "in_progress", "assigneeId": "u_1", "dueDate": "2025-09-15T00:00:00.000Z" },
    { "id": "t_2", "projectId": "p_1", "title": "Create task board", "status": "todo" },
    { "id": "t_3", "projectId": "p_1", "title": "Discuss roadmap", "status": "done" }
  ],
  "threads": [
    { "id": "th_1", "projectId": "p_1", "title": "Sprint 1 Goals", "authorId": "u_1", "replyCount": 2 }
  ],
  "replies": [
    { "id": "r_1", "threadId": "th_1", "authorId": "u_1", "body": "Kickoff today at 3 PM." },
    { "id": "r_2", "threadId": "th_1", "authorId": "u_1", "body": "Please review backlog before meeting." }
  ]
}
Implementation Order (for Coding Agent)
Bootstrap project with Vite + React + TS + Tailwind + React Router + React Query.

Add AuthProvider and protected route guard; implement Login/Signup/Forgot.

Integrate MSW with seeded data and all handlers.

Build Project List with create modal and progress summary.

Implement Project Detail with tabs: Overview, Tasks, Discussions.

Build Tasks feature: list or board, task create/edit modal, status changes with optimistic update.

Build Discussions: thread list, thread detail, reply editor, realtime via socket.io-client.

Add Notifications: bell, panel, unread logic, toast integration with socket events.

Add Settings/Profile and Logout.

PWA: manifest, icons, Workbox service worker, basic offline caching and outbox.

Final polish: accessibility audit, responsive tweaks, error states, tests, Lighthouse.

This README defines the full specification required to generate a production-quality MVP frontend that satisfies the problem statement across desktop and mobile form factors.