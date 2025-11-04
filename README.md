# ITC Hub

ITC Hub is a comprehensive, internal platform designed to streamline communication, project management, and collaboration within your organization. It provides a centralized hub for managing departments, teams, tickets, and events, fostering a more organized and efficient workflow.

## Features

- **Department & Team Management:** Create and manage departments and teams, assign members, and define roles.
- **Ticketing System:** A complete ticketing system to track tasks, issues, and requests. Assign tickets to users or teams, set priorities, and monitor progress.
- **Event Calendar:** Schedule and manage events, meetings, and workshops for your teams and departments.
- **User Management:** A role-based user management system (Admin, Manager, User).
- **Authentication & Authorization:** Secure authentication with email and password, and protected routes for authorized users.
- **Notifications:** Keep users informed about important updates and assignments.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [Next-Auth](https://next-auth.js.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, or bun 
- A PostgreSQL database

### Installation

1. **Clone the repo**
   
   ```sh
   git clone https://github.com/your_username/itc-hub.git
   ```

2. **Install NPM packages**
   
   ```sh
   npm install
   ```

3. **Set up your environment variables**
   
   Create a `.env` file in the root of your project and add the following variables:
   
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   NEXTAUTH_SECRET="your-super-secret-key"
   ```
   
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `NEXTAUTH_SECRET`: A secret key for Next-Auth. You can generate one with `openssl rand -hex 32`.
   - `NEXTAUTH_URL`: The base URL of your application (e.g., `https://itc-hub.vercel.app`).

4. **Set up the database**
   
   The following secrets are stored in the `AppSecret` table in your database. You will need to add these manually for the application to function correctly, especially for email services.
   
   - `EMAIL_HOST`: SMTP server host.
   - `EMAIL_PORT`: SMTP server port.
   - `EMAIL_SECURE`: `"true"` or `"false"` for SSL/TLS.
   - `EMAIL_USER`: SMTP username.
   - `EMAIL_PASSWORD`: SMTP password.
   - `EMAIL_FROM`: The "from" address for sending emails.
   - `APP_BASE_URL`: The base URL of your application (e.g., `https://itc-hub.vercel.app`).

5. **Run database migrations**
   
   ```sh
   npx prisma migrate dev
   ```

6. **Seed the database (optional)**
   
   ```sh
   npx prisma db seed
   ```

7. **Run the development server**
   
   ```sh
   npm run dev
   ```

## Deployment on Vercel

To deploy the ITC Hub on Vercel, follow these steps:

1. **Push your code to a Git repository** (e.g., GitHub, GitLab).

2. **Import your project into Vercel.**

3. **Configure the Environment Variables**
   
   In your Vercel project settings, add the following environment variables:
   
   - `DATABASE_URL`: Your production PostgreSQL connection string.
   - `NEXTAUTH_SECRET`: Your production Next-Auth secret.

4. **Database Setup**
   
   Before deploying, ensure your production database is running and accessible. You will also need to manually populate the `AppSecret` table with the required secrets for email and other services to work in production.

5. **Deploy**
   
   Vercel will automatically build and deploy your application.

## Branching Strategy & Workspace Layers

This repository follows a structured branching strategy where each branch represents a distinct "layer" of the project, with its own set of tools, data, and documentation. This approach ensures a clean and maintainable codebase.

### `production`

-   **Purpose:** This is the main branch for the live, client-facing application. It contains stable, tested code that is running with the client's own data.
-   **Deployment:** Deploys to the production environment on Vercel.
-   **Data:** Connects to the production database with live client data.
-   **Testing:** Limited to critical hotfixes. All major testing is completed before code is merged into this branch.
-   **Packages:** Contains only production dependencies.
-   **Obsidian Vault:** The Obsidian vault in this branch contains documentation related to the production environment, such as deployment guides, incident reports, and client-specific configurations.

### `preview`

-   **Purpose:** This branch is for testing the production build with seeded data. It's used for architectural reviews and to ensure new features are stable before merging into `production`.
-   **Deployment:** Deploys to a preview environment on Vercel.
-   **Data:** Connects to a staging or separate database with seeded data that mimics production data.
-   **Testing:** This branch is used for end-to-end testing, user acceptance testing (UAT), and integration testing.
-   **Packages:** May include additional packages for testing and analytics that are not present in the `production` branch.
-   **Obsidian Vault:** The Obsidian vault in this branch contains information about migration strategies, feature previews, and testing plans.

### `local`

-   **Purpose:** This is the primary development branch for creating and testing new features on a local machine.
-   **Deployment:** Runs on the developer's local machine.
-   **Data:** Can connect to a local PostgreSQL database or a local SQLite database for quick testing and feature development.
-   **Testing:** This branch is used for unit testing and component testing.
-   **Packages:** Includes all development dependencies, such as testing libraries and mock data generators.
-   **Obsidian Vault:** The Obsidian vault in this branch is used for system design documentation, development notes, and architectural patterns that are being explored for new features.