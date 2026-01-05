# My Calendar React

A modern calendar application built with React, TypeScript, and Ant Design.

## Tech Stack

- **React 19** - Modern React with functional components and Hooks
- **TypeScript** - Strict typing for better code quality
- **Vite** - Fast build tool and dev server
- **Ant Design** - Enterprise-grade UI component library
- **Zustand** - Lightweight state management
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in development mode.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run check` - Run lint, build, and tests

## Development Guidelines

- Use modern React with functional components and Hooks exclusively
- Keep components small and single-responsibility
- Extract reusable logic into custom Hooks prefixed with `use`
- Centralize shared state using Zustand
- Use TypeScript with strict typing - never use `any`
- Write semantic, accessible JSX
- Use CSS variables for colors, spacing, and typography
- Follow Ant Design guidelines for UI components

For detailed guidelines, see [agents.md](agents.md).
