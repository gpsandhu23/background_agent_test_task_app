# TaskFlow - Simple Task Management App

A minimalist task management app that helps busy professionals focus on what matters most, with zero friction between thought and action.

## Features

- ✨ **Quick Task Creation** - Add tasks in under 3 seconds
- 📱 **Mobile-First Design** - Optimized for touch with swipe gestures
- 🔄 **Recurring Tasks** - Set up daily, weekly, or monthly recurring tasks
- 🎯 **Priority-Based Organization** - Tasks sorted by priority (High, Medium, Low)
- 📅 **Due Date Support** - Never miss important deadlines
- 🔍 **Quick Search** - Find any task instantly
- 💾 **Offline Support** - Works without internet connection
- 🏷️ **Tags** - Organize tasks with custom tags

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd task_manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

## Usage

### Adding Tasks
- Click the **+** button or press Enter in the search bar
- Fill in task details (title is required)
- Set priority, due date, recurrence, and tags as needed

### Managing Tasks
- **Complete**: Click the checkbox or swipe right on mobile
- **Delete**: Click the X button or swipe left on mobile
- **Edit**: Click on a task to edit its details

### Views
- **Today**: Shows overdue and today's tasks
- **Upcoming**: Shows future tasks
- **Completed**: Shows completed tasks
- **All Tasks**: Shows all active tasks

### Mobile Gestures
- **Swipe Right**: Mark task as complete
- **Swipe Left**: Delete task
- **Tap**: Edit task details

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Technology Stack

- **React** with TypeScript
- **Local Storage** for offline-first data persistence
- **Service Worker** for PWA capabilities
- **CSS3** with modern responsive design
- **date-fns** for date manipulation

## Performance

- App launch: < 2 seconds
- Task creation: < 1 second
- Supports up to 10,000 tasks per user
- 30-day retention for completed tasks

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- iOS Safari 14+
- Chrome for Android

## License

This project is licensed under the MIT License.