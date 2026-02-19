# Support Ticket System

A professional-grade, containerized Support Ticket System featuring automatic ticket classification using an LLM (Large Language Model).

## Overview

This application allows users to submit support tickets, which are automatically categorized and prioritized by an AI model before submission. It provides a dashboard to view tickets, filter them, and see aggregated statistics.

Built with:
- **Backend**: Django & Django REST Framework
- **Frontend**: React (Vite)
- **Database**: PostgreSQL
- **AI Integration**: OpenAI (configurable)
- **Infrastructure**: Docker & Docker Compose

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed.
- An OpenAI API Key (optional, but required for auto-classification).

### Running the Application

1.  **Clone/Unzip the repository**.
2.  **Create a `.env` file** in the root directory (optional but recommended for secrets):
    ```env
    OPENAI_API_KEY=sk-your-api-key-here
    POSTGRES_DB=tickets_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    ```
    *Note: The `docker-compose.yml` has default values for DB credentials for ease of testing.*

3.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```

4.  **Access the App**:
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend API**: [http://localhost:8000/api/tickets/](http://localhost:8000/api/tickets/)
    - **Admin Panel**: [http://localhost:8000/admin/](http://localhost:8000/admin/) (Create a superuser via `docker-compose exec backend python manage.py createsuperuser` if needed).

## LLM Selection & Rationale

### Model: OpenAI GPT-3.5-turbo

I chose **GPT-3.5-turbo** for the following reasons:
1.  **Cost-Effectiveness**: It is significantly cheaper than GPT-4 while providing sufficient intelligence for text classification tasks.
2.  **Speed**: Low latency ensures the user experience remains snappy when tickets are auto-classified.
3.  **Instruction Following**: It adheres well to the strict JSON output format required by the backend, reducing parsing errors.
4.  **Availability**: High availability and rate limits suitable for a demonstration application.

## Design Decisions

### 1. Architecture: Containerized Microservices
The application is split into two distinct services (Frontend and Backend) orchestrated by Docker Compose. This ensures:
-   **Separation of Concerns**: The backend API is decoupled from the UI.
-   **Scalability**: Components can be scaled independently.
-   **Reproducibility**: `docker-compose up` guarantees the environment is identical across different machines.

### 2. Database Integrity
-   **PostgreSQL**: Chosen over SQLite for production-readiness.
-   **Constraints**: Data integrity (e.g., valid categories/priorities) is enforced at the database level, not just the frontend.

### 3. Fail-Safe AI Integration
-   **Graceful Degradation**: If the OpenAI API is down or the key is missing, the system catches the error and allows the user to manually select categories without crashing.
-   **Privacy**: Only the ticket description is sent to the LLM; no other user data is exposed.

## Tech Stack

-   **Backend**: Django 5.0, Django REST Framework
-   **Frontend**: React 18, Vite
-   **Database**: PostgreSQL 15
-   **Containerization**: Docker, Docker Compose


