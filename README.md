# LearnTrack

**Live Demo:** https://learntrackfinal.vercel.app

LearnTrack is a web application built with **React** and **Vite**.

## Tech Stack

- **React** — for building the user interface.
- **Vite** — for fast development and optimized builds.
- **HMR (Hot Module Replacement)** — updates changes during development without a full page reload.
- **ESLint** — helps maintain code quality and consistency.

## React Plugins

Vite offers two official React plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — uses [Oxc](https://oxc.rs/).
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) — uses [SWC](https://swc.rs/).

## React Compiler

The React Compiler is not enabled by default because it can affect development and build performance.

To enable it, follow the [official React Compiler installation guide](https://react.dev/learn/react-compiler/installation).

## ESLint Configuration

For production applications, consider using TypeScript with type-aware ESLint rules to improve code quality and catch potential errors.

You can start with the [React + TypeScript Vite template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) and integrate [typescript-eslint](https://typescript-eslint.io/).

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
