# census-AI-analyzer

This project is a backend API that analyzes US Hispanic census data and provides AI-powered insights.

## Features Implemented

*   **Census Data Processing**: Fetches and processes Hispanic demographic data from the US Census API.
*   **AI Analysis**: Generates strategic insights using Anthropic's Claude AI.
*   **RESTful API**: Provides clean, documented endpoints for data access.
*   **Data Caching**: Implements a caching mechanism to reduce redundant calls to the Census API.
*   **Data Export**: Supports exporting data to both CSV and Excel formats.
*   **QR Code Generation**: Includes an endpoint for generating QR codes.

## Technologies Used

*   **Backend**: Node.js, Express.js
*   **AI**: Anthropic Claude AI (`@anthropic-ai/sdk`)
*   **Data Source**: US Census Bureau API
*   **Data Processing**: `axios` for API requests, `xlsx` for Excel export, `csv-writer` for CSV export.
*   **API Security/Middleware**: `helmet` for security headers, `cors` for cross-origin resource sharing, `morgan` for logging.
*   **Other**: `qrcode` for QR code generation.

## Setup and Run Instructions

### Prerequisites

*   Node.js and npm
*   An Anthropic API key
*   A US Census API key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/muhdsaeed1/census-AI-analyzer.git
    cd census-AI-analyzer
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root of the project and add the following environment variables:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
CENSUS_API_KEY=your_census_api_key
PORT=3000
```

<<<<<<< HEAD
### Running the Application

You can run the application in two ways:

1.  **As a server**:
    ```bash
    npm start
    ```
    This will start the Express server and expose the API endpoints. The API will be available at `http://localhost:3000`.

2.  **As a script**:
    ```bash
    npm run script
    ```
    This will run the `census-AI-analyzer.js` script directly, which will fetch the data, generate the analysis, and save the output files.

## Notes on AI Usage

This project leverages AI to generate strategic insights from census data. Here's how it works:

*   **Tool**: The application uses the `@anthropic-ai/sdk` to communicate with the Anthropic Claude AI.
*   **Context**: The `census-AI-analyzer.js` script performs the following steps:
    1.  Fetches demographic data from the US Census API.
    2.  Processes and structures the data to highlight key metrics related to the Hispanic population.
    3.  Constructs a detailed prompt that includes the processed data.
    4.  Sends the prompt to the `claude-sonnet-4-20250514` model.
    5.  The prompt asks the AI to provide a high-level assessment of the Hispanic retail opportunity for a company like Amazon, focusing on:
        *   Spanish-language marketing.
        *   Digital shopping behavior.
        *   Long-term brand strategy.
*   **Output**: The AI-generated analysis is then returned as part of the API response and included as a separate sheet in the exported Excel file.
=======
## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI**: Anthropic Claude API
- **Data**: US Census Bureau API
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Export**: XLSX, CSV Writer



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



