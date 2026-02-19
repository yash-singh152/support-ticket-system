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

## Design Decisions

### 1. Architecture: Microservices-lite
The application is split into two distinct services (Frontend and Backend) orchestrated by Docker Compose. This ensures separation of concerns and allows each part to scale independently.
- **Backend** acts as a pure REST API.
- **Frontend** is a Single Page Application (SPA).
- **Nginx** (optional for prod, currently using Vite dev server for assessment speed) serves the frontend.

### 2. LLM Integration
- **Model**: OpenAI GPT-3.5-turbo (efficient and cost-effective).
- **Fail-safe**: If the LLM call fails (network issue, invalid key), the system gracefully degrades. The user can still select categories manually.
- **Privacy**: Only the description is sent to the LLM.

### 3. Database & Optimization
- **Enforced Constraints**: Data integrity is enforced at the database level (PostgreSQL) using proper field types and constraints.
- **Efficient Querying**: The stats endpoint uses Django's `aggregate` and `annotate` to perform calculations in the database, avoiding slow Python loops.

### 4. UI/UX
- **Clean Interface**: A modern, clean interface focusing on readability and ease of use.
- **Real-time Feedback**: Loading states indicate when the AI is processing.
- **Optimistic Updates**: (Where applicable) UI updates immediately for better perceived performance.

## Tech Stack Details

- **Django 5.0**: Latest version for security and features.
- **React 18 + Vite**: Fast build tool and modern React features.
- **PostgreSQL 16**: Robust relational database.

