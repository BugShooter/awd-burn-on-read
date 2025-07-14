# Burn on Read Service

**Burn on Read** is a service for sending messages or files that are automatically deleted after being viewed once by the recipient.

## Description

The service follows the "read and burn" principle: a user submits a message or file, receives a unique link, and shares it with someone else. As soon as the recipient opens the link, the content is displayed and immediately deleted from the server.

## Objectives

- Build a web service using Node.js, Express.js, and TypeScript.
- Practice working with the Node.js file API using promises (`fs/promises`) for asynchronous file operations.
- Use Nunjucks for templating and a modern CSS framework (e.g., [Pico.css](https://picocss.com/)) for basic styling.

## Technology Stack

- **Node.js** — runtime environment
- **Express.js** — web framework
- **TypeScript** — static typing
- **Nunjucks** — templating engine
- **fs/promises** — asynchronous file operations
- **CSS framework** (optional)

## How the Service Works

1. **Send:** The user enters text or uploads a file.
2. **Save:** The data is stored in a temporary file using `fs/promises`.
3. **Link Generation:** The user receives a unique link to share.
4. **View:** The recipient opens the link and sees the content.
5. **Delete:** After viewing, the file is immediately deleted.

## Requirements

- Implement the app using Express.js and TypeScript.
- Use Nunjucks for rendering pages.
- Style the interface with your own CSS or a CSS framework.
- Provide a text input field.
- Store data in a file using `fs/promises`.
- Sanitize user input before saving.
- Show a unique link to the user after file creation.
- Delete the file immediately after the link is visited.

## Optional

- Add support for file uploads.
- Do not store data longer than necessary for a single view.

---

**Good luck with the challenge!**

## Getting Started

1. Create a new Node.js project.

```bash
mkdir burn-on-read
cd burn-on-read
npm init -y
```

2. Install the required dependencies and development tools:

```bash
npm install express nunjucks dotenv
npm install --save-dev typescript ts-node nodemon prettier prettier-plugin-jinja-template
npm install --save-dev @types/node @types/express @types/nunjucks
```

3. Create a `tsconfig.json` file for TypeScript configuration:

```json
{
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist",
        "target": "ES2020",
        "module": "ESNEXT",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node",
        "resolveJsonModule": true
    },
    "ts-node": {
        "esm": true,
        "files": true
    }
}
```

This configuration file for TypeScript specifies the following important options:

- The target ECMAScript version is set to `ES2020`.
- The module system is set to `ESNEXT`.
- ES module interoperability is enabled.
- Consistent casing in file names is enforced.
- Module resolution is set to `node`.
- JSON module resolution is enabled.

4. Set in the `package.json` to use ES modules by adding the following line:

```json
{
    "type": "module"
}
```

5. Create a `nodemon.json` file for development:

Nodemon is a tool that helps develop Node.js applications by automatically restarting the server when file changes are detected. Create a `nodemon.json` file in the root directory:

```json
{
    "watch": ["src"],
    "ext": "ts,json,html",
    "ignore": ["node_modules", "dist"],
    "exec": "ts-node src/index.ts"
}

```json
{
    "watch": ["src"],
    "ext": "ts,json,html",
    "ignore": ["node_modules", "dist"],
    "exec": "ts-node src/index.ts"
}
```

This configuration file for Nodemon specifies:

- Files to watch for changes (`src` directory).
- File extensions to monitor (`ts`, `json`, `html`).
- Directories to ignore (`node_modules`, `dist`).
- Command to execute (`ts-node src/index.ts`).

6. Configure Prettier

Create a `prettier.config.js` file for Prettier configuration

```json
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": true,
    "trailingComma": "none",
    "printWidth": 120,
    "plugins": ["prettier-plugin-jinja-template"],
    "overrides": [
        {
            "files": ["*.html"],
            "options": {
                "parser": "jinja-template"
            }
        }
    ]
}
```

Create a `.prettierignore` file to ignore specific files:

```
package-lock.json
dist
node_modules
src/public
**/*.min.js
```

7. Create a `.gitignore` file to ignore unnecessary files:

```.gitignore
# Ignore node modules and build artifacts
node_modules
dist

# Ignore logs and zip files
*.log
*.zip

# Ignore local configuration files
*.local
```

8. Add scripts to `package.json` for building, developing, and starting the application:

```json
{
    "scripts": {
        "build": "tsc",
        "dev": "nodemon --exec \"node --import ./register.mjs\" src/index.ts",
        "watch": "tsc --watch",
        "format": "prettier --write .",
        "format:check": "prettier --check .",
        "start": "node dist/index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    }
}
```

This configuration adds the following scripts:

- `build`: Compiles TypeScript files to JavaScript.
- `start`: Starts the application using the compiled JavaScript files in the `dist` directory.
- `dev`: Starts the development server with Nodemon, watching for changes in TypeScript files.
- `watch`: Watches for changes in TypeScript files and recompiles them automatically.
- `format`: Formats the code using Prettier.

9. Initialize a Git repository:

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
# Add your remote repository URL here
# For example, if you have a GitHub repository, you can add it like this:
# git remote add origin <your-repo-url>
# git push -u origin main # -u sets the upstream branch
```

## Optional

### Install Pico.css framework:

```bash
npm install @picocss/pico
```

Link: [Pico.css Documentation](https://picocss.com/docs)

## Tips & Tricks

### How to use `dotenv` with ES modules
To use `dotenv` with ES modules, you need to import it at the top of your entry file (e.g., `index.ts`) and call `config()`:

```typescript
import dotenv from 'dotenv'
dotenv.config({ path: ['.env.local', '.env'] })

// access environment variables like this
// const port = process.env.PORT || 3000
```

When working with `.env` and `.env.local` files, keep in mind the following:

- The `.env` file is used for default environment variables.
- The `.env.local` file is used for local overrides and should not be committed to version control.
- Always load the `.env.local` file first to allow for local customization.

