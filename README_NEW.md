# DinePilot - Indian Restaurant POS System

A modern, full-featured Point of Sale (POS) system built for Indian restaurants using React, TypeScript, and Vite. This project includes a comprehensive Docker setup and extensive unit test coverage.

## Features

- **Multi-Role System**: Support for Customers, Chefs, and Managers
- **Real-time Order Management**: Track orders from placement to delivery
- **Responsive UI**: Built with Tailwind CSS for excellent UX
- **Docker Ready**: Multi-stage Docker build for easy deployment
- **Comprehensive Testing**: 53+ unit tests with 100% passing rate
- **TypeScript**: Full type safety across the application
- **Vite**: Lightning-fast development and production builds

## Project Structure

```
├── components/           # React components
│   ├── LoginScreen.tsx
│   ├── CustomerPanel.tsx
│   ├── ChefPanel.tsx
│   ├── ManagerPanel.tsx
│   └── DevOpsPanel.tsx
├── services/            # Backend services
│   └── db.ts
├── types.ts             # TypeScript type definitions
├── constants.ts         # Application constants
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── Dockerfile           # Docker configuration
├── vitest.config.ts     # Test configuration
└── package.json         # Dependencies
```

## Prerequisites

- **Node.js** 20+ (for local development)
- **Docker** (for containerized deployment)
- **npm** or **yarn** (package managers)

## Installation & Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dinepilot.git
   cd dinepilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (if needed):
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t dinepilot .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 dinepilot
   ```

The application will be accessible at `http://localhost:3000`

## Available Scripts

### Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once (CI mode)
- `npm run test:ui` - Run tests with Vitest UI

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite 6
- **Testing**: Vitest, React Testing Library, @testing-library/jest-dom
- **Runtime**: Node.js 20 Alpine (Docker)
- **Package Manager**: npm

## Test Coverage

The project includes comprehensive unit tests with 53 passing tests across 4 test suites:

- **types.test.ts** (13 tests): Type safety and data structures
- **utils.test.ts** (18 tests): Utility functions and calculations
- **App.test.tsx** (11 tests): Main app component
- **components/LoginScreen.test.tsx** (11 tests): Authentication UI

Run tests with:
```bash
npm run test:run
```

## API & Types

### User Roles
- `customer`: Place orders and view profile
- `chef`: Manage cooking orders
- `manager`: View analytics and manage restaurant

### Order Statuses
- `Placed` - Order just created
- `Cooking` - Being prepared
- `Ready` - Ready for pickup
- `Served` - Delivered to customer

### Menu Categories
- Main courses
- Starters
- Bread items
- Rice dishes
- Desserts
- Beverages

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
GEMINI_API_KEY=your_api_key_here
```

## Docker Configuration

The Dockerfile uses a multi-stage build for optimal image size:

1. **Builder Stage**: Installs dependencies and builds the app
2. **Runtime Stage**: Only includes necessary files for production

This approach keeps the final image size minimal while ensuring all dependencies are properly resolved.

## Troubleshooting

### Docker Build Fails with Peer Dependency Error
The Dockerfile uses `--legacy-peer-deps` to handle React 19 with testing libraries that expect React 18. This is a known compatibility issue.

### Port Already in Use
If port 3000 is already in use, map to a different port:
```bash
docker run -p 8080:3000 dinepilot
```

### Tests Fail Locally
Ensure you have Node 20+ installed:
```bash
node --version
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

Prakhar Saxena - Full Stack Developer

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact me directly.

---

**Built with ❤️ for Indian restaurants and their digital transformation**
