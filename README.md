# Simple Guide to Start a Project with Node.js and TypeScript

> Guide available in [Spanish](README.es.md)

## Table of Contents

-   [Configuration](#configuration)
-   [Features](#features)
-   [Usage](#usage)
    -   [ESlint](#eslint)
    -   [Prettier](#prettier)
    -   [Run the project](#run-the-project)
-   [Example](#example)
-   [To Do](#to-do) (only in this readme)

## Features

-   [pnpm](https://pnpm.io/) to manage dependencies
-   [TypeScript](https://typescriptlang.org/)
-   [ESlint](https://eslint.org/) for syntax errors
-   [Prettier](https://prettier.io/) to format the code

## Configuration

### 1. Create a directory for the project

```bash
mkdir node_project
cd node_project
```

### 2. Initialize the project with pnpm

```bash
pnpm init
```

Copy the following and paste it into `package.json`.

```json
{
    "name": "getting-started-node-typescript",
    "repository": {
        "type": "git",
        "url": "https://github.com/rapax00/getting-started-node-typescript"
    },
    "keywords": [],
    "author": "Rapax",
    "license": "MIT",
    "homepage": "https://github.com/rapax00/getting-started-node-typescript#readme",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "tsc && node dist/index.js",
        "lint": "eslint .",
        "format": "exec prettier . --write",
        "format-spec": "prettier --write",
        "check": "prettier . --check",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "devDependencies": {
        "@eslint/js": "^9.9.1",
        "eslint": "^9.9.1",
        "globals": "^15.9.0",
        "prettier": "3.3.3",
        "typescript": "^5.5.4",
        "typescript-eslint": "^8.3.0"
    }
}
```

### 3. Establish the node version

Create a file `.nvmrc`

```bash
touch .nvmrc
```

Copy the following and paste it into `.nvmrc`. ( or use the version you want )

```txt
v20.13
```

### 4. Create a file to ignore the files that are not necessary

```bash
touch .gitignore
```

Copy the following and paste it into `.gitignore`.

```txt
node_modules
dist
```

### 5. Create a configuration file for TypeScript

```bash
touch tsconfig.json
```

Copy the following and paste it into `tsconfig.json`.

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "strict": true,
        "noImplicitAny": true,
        "skipLibCheck": true
    },
    "lib": ["es2015"],
    "include": ["**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### 6. Install the dependencies

```bash
pnpm i
```

### 7. Configure ESLint

Create a configuration file

```bash
pnpm eslint --init
```

Select the following options:

1. How would you like to use ESLint?
    - To check syntax and find problems
2. What type of modules does your project use?
    - JavaScript modules (import/export)
3. Which framework does your project use?
    - None of these
4. Does your project use TypeScript?
    - Yes
5. Where does your code run?
    - Node
6. Would you like to install them now?
    - Yes
7. Which package manager do you want to use?
    - pnpm

Copy the following and paste it into `eslint.config.mjs`.

```javascript
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { ignores: ['node_modules', 'dist'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
```

### 8. Configure Prettier

Create a configuration file

```bash
touch .prettierrc
```

Copy the following and paste it into `.prettierrc`.

```json
{
    "printWidth": 80,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "bracketSpacing": true,
    "jsxBracketSameLine": false,
    "arrowParens": "always"
}
```

Create an ignore file for Prettier

```bash
touch .prettierignore
```

Copy the following and paste it into `.prettierignore`.

```txt
node_modules
dist
```

> Prettier will also follow rules specified in .gitignore if it exists in the same directory from which it is executed.

## Usage

### ESLint

Check if there are syntax errors

```bash
pnpm lint
```

### Prettier

Format the code

```bash
pnpm format
```

Format the specific folder or file

```bash
pnpm format-spec <path>
```

Format the specific test file

```bash
pnpm format-spec <ruta/**/*.test.js>
```

Check if the code is formatted correctly

```bash
pnpm check
```

## Example

> This is a simple example to test the project

1. Create directory

```bash
mkdir src
```

Move to the directory

```bash
cd src
```

Create a file `index.ts`

```bash
touch index.ts
```

Copy the following and paste it into

```typescript
console.log('Congratulations, you are ready to start coding! 🎉');
```

2. Run the project and enjoy it

> See your console

```bash
pnpm start
```

> Compiles the project and runs the file `dist/index.js`

## To Do

-   [ ] Guide for fork the project

---

Made with :open_hands: by [Rapax](https://rapax.dev)

Tips are welcome through Lightning Zap to :zap:**rapax@lawallet.ar**.
