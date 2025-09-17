![census ai](https://github.com/user-attachments/assets/539fcf05-3404-44be-abb9-8db58122e3f3)
# census-AI-analyzer - Backend API

US Hispanic Census Data Analytics API with AI-powered insights using Claude AI.

## Features

- 📊 **Census Data Processing**: Fetches and processes Hispanic demographic data from US Census API
- 🤖 **AI Analysis**: Generates strategic insights using Anthropic's Claude AI
- 🚀 **RESTful API**: Clean, documented endpoints for data access
- ⚡ **Caching**: Smart caching to minimize API calls
- 🛡️ **Security**: Helmet, CORS, rate limiting
- 📈 **Export**: CSV and Excel data export capabilities

## API Endpoints

- `GET /health` - Health check and cache status
- `GET /api/docs` - API documentation
- `GET /api/census/raw` - Raw census data with numeric values
- `GET /api/census/formatted` - Display-ready formatted data
- `GET /api/census/analysis` - AI analysis only
- `GET /api/census/summary` - Summary statistics
- `POST /api/cache/clear` - Clear data cache

## Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=production
PORT=3000
```

## Local Development

```bash
# Install dependencies
npm install

# Set environment variables
export ANTHROPIC_API_KEY=your_key_here

# Start development server
npm run dev
```

## How to Run the Application

This project consists of two parts: a backend API and a frontend dashboard.

### Backend

1.  Navigate to the `census-AI-analyzer` directory.
2.  Install the dependencies: `npm install`
3.  Set the environment variables as described in the "Environment Variables" section.
4.  Start the development server: `npm run dev`
5.  The API will be running at `http://localhost:3000`.

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  The frontend will be running at `http://localhost:5173`.

## How to Test the Application

This project does not have any automated tests yet. However, you can manually test the application by running it locally and interacting with the API and the frontend.

## How to Use QR Codes

This application includes a QR code generator.

1.  Run the application and navigate to the "QR Generator" tab in the frontend.
2.  Enter any text or URL in the input field.
3.  Click the "Generate" button.
4.  The QR code will be displayed on the screen.

## Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
# Build for production
NODE_ENV=production npm start
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI**: Anthropic Claude API
- **Data**: US Census Bureau API
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Export**: XLSX, CSV Writer

## AI-Assisted Development

As a large language model, I can assist in the development of this project in several ways. Here's how I can leverage different sources of information to improve the development workflow:

### API Specs

The API specification, which can be found in the `/api/docs` endpoint and in the `server.js` file, is a valuable source of information. I can use it to:

*   **Generate client-side code:** I can automatically generate TypeScript or JavaScript code for the frontend to interact with the API, including request and response types.
*   **Create API documentation:** I can generate or update the API documentation in various formats (e.g., OpenAPI, Swagger) based on the API specs.
*   **Generate API tests:** I can generate tests for the API endpoints to ensure they are working as expected.

### File Trees

The file tree of the project provides a high-level overview of the project structure. I can use it to:

*   **Understand the project structure:** I can quickly understand the project's architecture and how the different parts are organized.
*   **Identify relevant files:** When I need to make changes to the code, I can use the file tree to quickly identify the relevant files.
*   **Suggest refactoring:** I can analyze the file tree and suggest improvements to the project structure.

### Diffs

Diffs, which show the changes between two versions of a file, are a great way to understand the evolution of the code. I can use them to:

*   **Review code changes:** I can review code changes and provide feedback on the implementation.
*   **Understand the context of a change:** I can use the diff to understand why a change was made and what the author's intention was.
*   **Identify potential issues:** I can analyze the diff and identify potential issues, such as bugs or performance regressions.

## Development Methodology

This project follows an **Agile development methodology**, specifically incorporating the **ADIE (Analysis, Design, Implementation, Evaluation) model**. This approach is particularly effective for this project for the following reasons:

*   **Flexibility and Iteration:** The ADIE model is a cyclical process, which allows for continuous improvement and adaptation. This is ideal for a project like this, where new features and requirements may arise as the project evolves.
*   **Rapid Prototyping:** The ADIE model encourages rapid prototyping and feedback. We can quickly move from an idea to a working implementation, and then evaluate it to see if it meets the project's goals.
*   **Focus on User Feedback:** The evaluation phase of the ADIE model is crucial for gathering user feedback. This feedback can then be used to inform the next cycle of development, ensuring that the project is always moving in the right direction.

Here's how the ADIE model is applied to this project:

1.  **Analysis:** In this phase, we analyze the project's requirements and define the goals for the current development cycle. This could involve analyzing user feedback, identifying new feature ideas, or defining the scope of a new API endpoint.
2.  **Design:** In this phase, we design the new feature or improvement. This could involve creating wireframes for a new UI component, designing the schema for a new database table, or defining the architecture of a new microservice.
3.  **Implementation:** In this phase, we implement the new feature or improvement. This involves writing the code, creating the necessary infrastructure, and deploying the changes to a staging environment.
4.  **Evaluation:** In this phase, we evaluate the new feature or improvement to see if it meets the project's goals. This could involve user testing, performance testing, or A/B testing. The feedback from this phase is then used to inform the next development cycle.

## License

MIT License - see LICENSE file for details.
