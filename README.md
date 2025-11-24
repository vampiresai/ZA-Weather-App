# Gauteng 3D Aether

A beautiful 3D weather visualization application for Gauteng, South Africa, powered by Google Gemini AI and React Three Fiber.

## Features

- Real-time weather data for Gauteng, South Africa
- Interactive 3D scene visualization that changes based on weather conditions
- Powered by Google Gemini Search Grounding for accurate weather information
- Modern React + TypeScript + Vite stack
- Beautiful UI with smooth animations

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**
- A **Google Gemini API key** ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

### 1. Download/Clone the Project

If you have the project files, navigate to the project directory:

```bash
cd gauteng-3d-aether
```

If you're cloning from a repository:

```bash
git clone <repository-url>
cd gauteng-3d-aether
```

### 2. Install Dependencies

Install all required packages:

```bash
npm install
```

## Configuration

### 3. Set Up API Key

Create a `.env.local` file in the root directory of the project:

```bash
# On Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# On macOS/Linux
touch .env.local
```

Add your Google Gemini API key to the `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

**Important:** 
- Replace `your_api_key_here` with your actual Google Gemini API key
- Never commit the `.env.local` file to version control
- The `.env.local` file is already included in `.gitignore` (if not, add it)

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://0.0.0.0:3000

The dev server supports hot module replacement, so changes will automatically reload in the browser.

### Production Build

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
gauteng-3d-aether/
├── components/
│   ├── Scene.tsx          # 3D scene component using React Three Fiber
│   └── WeatherCard.tsx    # Weather information card UI
├── services/
│   └── weatherService.ts  # Weather data fetching service
├── App.tsx                # Main application component
├── index.tsx              # Application entry point
├── index.html             # HTML template
├── types.ts               # TypeScript type definitions
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies and scripts
└── .env.local             # Environment variables (create this file)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Three Fiber** - 3D graphics library
- **Three.js** - 3D rendering engine
- **Google Gemini AI** - Weather data via search grounding
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling (via CDN)

## Troubleshooting

### API Key Issues

If you encounter "API Key not found" errors:
1. Ensure `.env.local` exists in the root directory
2. Verify the file contains `GEMINI_API_KEY=your_actual_key`
3. Restart the development server after creating/modifying `.env.local`
4. Make sure there are no spaces around the `=` sign

### Port Already in Use

If port 3000 is already in use, you can modify the port in `vite.config.ts` or stop the process using that port.

### Build Errors

If you encounter build errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear your browser cache

## Security Notes

- **Never commit API keys** to version control
- The `.env.local` file should be in `.gitignore`
- API keys are only used on the server-side during build/dev
- For production deployments, use secure environment variable management provided by your hosting platform

