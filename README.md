# Introduction

This project serves as the backend service for the Graph Task Generator, designed to generate tasks involving graphs and export them as PDF files.

## Key Features

* **Task Generation**: Generate tasks with customizable graph parameters.
* **Graph Creation**: Create and layout graphs using Graphology.
* **PDF Export**: Export tasks and graphs as PDF files.
* **Input Validation**: Validate task input data to ensure correctness.
* **Error Handling**: Handle errors gracefully with custom middleware.

# For Developers

## Technologies Used

The project leverages a variety of technologies, including:

- **Express.js**: A flexible Node.js web application framework for creating the server and handling HTTP requests.
- **Graphology**: A robust and versatile library for graph theory, used for generating and manipulating graphs, as well as creating SVG images from them
- **pdf-lib**: A powerful library for creating and modifying PDF documents in JavaScript.
- **Sharp**: A high-performance image processing library used to convert SVG images to PNG format.
- **TypeScript**: A statically typed superset of JavaScript that enhances code quality and maintainability.

## Project Structure

```
.env
.gitignore
generated_pdf/
    generated_task.pdf
graph_svg/
    graph.svg
package.json
src/
    controllers/
        dataController.ts
    middleware/
        errorHandler.ts
    models/
        taskModel.ts
    routes/
        dataFromFrontend.ts
    server.tsx
    services/
        generateGraph.ts
        generateGraphImage.ts
        generatePDF.ts
        taskService.ts
    utils/
        validationUtils.ts
tsconfig.json
```

## Installation

1. Clone the repository
2. Install dependencies (**npm install**)
3. Create a [.env](vscode-file://vscode-app/c:/Users/Benj%C3%A1min/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) file in the root directory and add any necessary environment variables.

## Scripts

* `npm run dev`: Start the development server using `ts-node`.
* `npm run build`: Compile the TypeScript code to JavaScript.
* `npm start`: Start the compiled server.

## API Endpoints

### Generate Task

* **URL** : `/api/generate-task`
* **Method** : `POST`
* **Description** : Generates a task with a graph and exports it as a PDF.
* **Request Body** :

  ```
  {
  "taskType": "string",
  "graphNodes": "number",
  "graphEdges": "number",
  "taskTitle": "string",
  "taskText": "string",
  "dateChecked": "boolean",
  "date": "string (optional, ISO format)"
  }
  ```
* **Response** :
* Success: Returns the generated PDF file.
* Error: Returns an error message.

## Error Handling

Errors are handled by the custom error handler middleware defined in [errorHandler.ts](vscode-file://vscode-app/c:/Users/Benj%C3%A1min/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

## Validation

Input validation is performed using the utility functions defined in [validationUtils.ts](vscode-file://vscode-app/c:/Users/Benj%C3%A1min/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

## Graph Generation

Graphs are generated using the functions defined in [generateGraph.ts](vscode-file://vscode-app/c:/Users/Benj%C3%A1min/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

## PDF Generation

PDF files are generated using the functions defined in [generatePDF.ts](vscode-file://vscode-app/c:/Users/Benj%C3%A1min/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html).

# Other

## License

This project is licensed under the the Apache License. See the LICENSE file for details.

## Author

This project is maintained by Benjámin Bartha-Tóth as part of his MA thesis work at ELTE Eötvös Lorán University (Hungary).
