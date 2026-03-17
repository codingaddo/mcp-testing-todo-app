# MCP Testing To-do App

Browser-only to-do list built with Next.js and TypeScript for the MCP Testing project. All data is stored locally in the browser using `localStorage`; there is no backend or external API.

## Tech stack

- [Next.js 14](https://nextjs.org/) with the App Router
- React 18 with TypeScript
- ESLint (Next.js core web vitals config)
- Prettier for formatting

## Prerequisites

- Node.js 18 or newer
- npm (comes with Node) or your preferred package manager (pnpm, yarn)

## Getting started

1. **Clone the repository**

   ```bash
   git clone https://github.com/codingaddo/mcp-testing-todo-app.git
   cd mcp-testing-todo-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000 in your browser.

4. **Run linting**

   ```bash
   npm run lint
   ```

5. **Create a production build**

   ```bash
   npm run build
   ```

## Data persistence

- To-dos are stored in `localStorage` under a project-specific key.
- The list is saved automatically whenever you add, toggle, or delete a task.
- On page load, the app reads from `localStorage` and restores your tasks.
- If `localStorage` is cleared or the stored data is corrupted, the app falls back to an empty list without crashing.

Because all data lives in the browser, tasks are specific to the device and browser you use and will be lost if you clear site data or `localStorage`.

## Features

- Add tasks via the input and **Add** button or by pressing **Enter**
- Ignore empty or whitespace-only input
- Toggle completion state for each task
- Delete individual tasks
- Long task text wraps gracefully without breaking the layout
- Responsive layout for mobile and desktop
- Visual distinction for completed tasks (strikethrough and muted color)
- Clear empty state message when there are no tasks
- Basic focus and hover states for interactive elements to support accessibility

## Notes

- All logic runs in the browser; there are **no backend or external API calls**.
- This project implements Azure Boards user stories US1–US4 for the MCP Testing project.
