# Crisp

Crisp is a modern web application designed to provide a comprehensive platform for managing various administrative tasks, reporting, and analytics. Built with Next.js, TypeScript, and Tailwind CSS, Crisp offers a modular and scalable architecture for developers and users alike.

## Features

- **Admin Dashboard**: Manage alerts, analytics, communication, feedback, integrations, and more.
- **Interactive Maps**: Includes support for Cesium and MapLibre for advanced mapping capabilities.
- **UI Components**: A rich library of reusable UI components such as buttons, forms, tables, and more.
- **API Endpoints**: RESTful API endpoints for incidents, reports, search, stats, and tracking.
- **Authentication**: Secure login functionality for administrators.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

The project is organized as follows:

- `app/`: Contains the main application pages and routes.
- `components/`: Houses reusable UI components and map integrations.
- `hooks/`: Custom React hooks for shared logic.
- `lib/`: Utility functions and Prisma client setup.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets such as images and Cesium resources.
- `styles/`: Global CSS styles.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- A PostgreSQL database

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Twilight-Techy/crisp.git
   cd crisp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure the required environment variables. Refer to `.env.example` for guidance.

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open the application:**
   Navigate to `http://localhost:3000` in your browser.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality issues.

## Technologies Used

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Mapping**: Cesium and MapLibre

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Cesium](https://cesium.com/)
- [MapLibre](https://maplibre.org/)
