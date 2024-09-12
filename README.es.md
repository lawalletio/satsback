# Guia simple para inciar un proyecto con Node.js y TypeScript

## Indice

-   [Configuración](#configuración)
-   [Características](#características)
-   [Uso](#uso)
    -   [ESlint](#eslint)
    -   [Prettier](#prettier)
    -   [Correr el proyecto](#correr-el-proyecto)
-   [Ejemplo](#ejemplo)

## Características

-   [pnpm](https://pnpm.io/) para manejar las dependencias
-   [TypeScript](https://typescriptlang.org/)
-   [ESlint](https://eslint.org/) para errores de sintaxis
-   [Prettier](https://prettier.io/) para formatear el código

## Configuración

### 1. Crear un directorio para el proyecto

```bash
mkdir node_project
cd node_project
```

### 2. Inicializar el proyecto con pnpm

```bash
pnpm init
```

Copiar lo siguiente y pegarlo en `package.json`.

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

### 3. Establecer la versión de node

Crear un archivo `.nvmrc`.

```bash
touch .nvmrc
```

Copiar lo siguiente y pegarlo en `.nvmrc`. ( o la versión que prefieras )

```txt
v20.13
```

### 4. Crear un archivo para ingrnorar los archivos que no sean necesarios

```bash
touch .gitignore
```

Copiar lo siguiente y pegarlo en `.gitignore`.

```txt
node_modules
dist
```

### 5. Crear un archivo de configuración para TypeScript

```bash
touch tsconfig.json
```

Copiar lo siguiente y pegarlo en `tsconfig.json`.

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

### 6. Instalar las dependencias

```bash
pnpm i
```

### 7. Configurar ESLint

Crear un archivo de configuración

```bash
pnpm eslint --init
```

Seleccionar las siguientes opciones:

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

Copiar lo siguiente y pegarlo en `eslint.config.mjs`.

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

### 8. Configurar Prettier

Crear un archivo de configuración

```bash
touch .prettierrc
```

Copiar lo siguiente y pegarlo en `.prettierrc`.

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

Crear un archivo de ignore para prettier

```bash
touch .prettierignore
```

Copiar lo siguiente y pegarlo en `.prettierignore`.

```txt
node_modules
dist
```

> Prettier también seguirá las reglas especificadas en .gitignore si existe en el mismo directorio desde el que se ejecuta.

## Uso

### ESLint

```bash
pnpm lint
```

### Prettier

Formatear el código

```bash
pnpm format
```

Formatear una carpeta o archivo específico

```bash
pnpm format-spec <ruta>
```

Formatear todos los archivos de prueba

```bash
pnpm format-spec <ruta/**/*.test.js>
```

Chequear si el código está formateado

```bash
pnpm check
```

## Ejemplo

> Este es un ejemplo simple para probar el proyecto

1. Crear directorio

```bash
mkdir src
```

Moverse al directorio

```bash
cd src
```

Crear un archivo `index.ts`

```bash
touch index.ts
```

Copiá lo siguiente y pegalo dentro

```typescript
console.log('Congratulations, you are ready to start coding! 🎉');
```

2. Ejecutá el proyecto y disfrutalo

> Mirá tu consola

```bash
pnpm start
```

> Compila el proyecto y ejecuta el archivo `dist/index.js`

---

Hecho con :open_hands: por [Rapax](https://rapax.dev)

Tips son bienvenido a través de Lightning Zap a :zap:**rapax@lawallet.ar**.
