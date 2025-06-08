# Task Manager

A modern, responsive task management application built with React and TypeScript. This application helps users organize their tasks efficiently with features like priority management, offline support, and a clean, intuitive interface.

## Features

- 📱 **Responsive Design**: Works seamlessly on both desktop and mobile devices
- ⚡ **Quick Task Creation**: Add tasks with just a few taps/clicks
- 🎯 **Priority Management**: Organize tasks by priority levels
- 🔄 **Offline Support**: Works without internet connection
- 🎨 **Modern UI**: Clean and intuitive interface
- 📦 **Local Storage**: Persists data locally
- 🎯 **Task Categories**: Organize tasks by different categories
- 📅 **Due Dates**: Set and track task deadlines
- 🔍 **Search & Filter**: Easily find specific tasks
- 📱 **Mobile Gestures**: Swipe to complete/delete tasks on mobile

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Icons
- React Hot Toast
- Service Workers (for offline support)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gpsandhu23/background_agent_test_task_app.git
cd background_agent_test_task_app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
background_agent_test_task_app/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── services/      # Service modules
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── index.html         # HTML template
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- Toast notifications by [React Hot Toast](https://react-hot-toast.com/)
- Styling powered by [Tailwind CSS](https://tailwindcss.com/) 