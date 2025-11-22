# Since App

A simple mobile app for tracking how much time has passed since meaningful events in your life.

## Description

Since is a minimalist time tracker that helps you keep track of personal milestones. Whether it's "Days since I started dating my girlfriend", "Days since I moved to X city", or "Days since I quit smoking", Since makes it easy to see how much time has passed.

The app is designed to be simple and focused—not a full habit tracker or stats app. It's just for tracking little meaningful things with basic configuration, optional reminders, and optional milestones.

## Tech Stack

- **React Native** + **Expo** (TypeScript)
- **React Navigation** - Native stack navigation
- **SQLite** - Local database storage
- **Drizzle ORM** - Type-safe database queries
- **Zustand** - Lightweight state management
- **date-fns** - Date manipulation and formatting
- **Expo Notifications** - For reminders (coming soon)
- **TypeScript** - Strict mode enabled
- **ESLint** + **Prettier** - Code quality and formatting
- **Jest** - Unit testing

## Features

### ✅ MVP (v0.1)

- ✅ Create / edit / delete events
- ✅ Local storage with SQLite + Drizzle
- ✅ Home list with "time since" display
- ✅ Event detail screen
- ✅ Basic settings screen (placeholder)
- ✅ Configurable time units (days, weeks, months, years)
- ✅ Pinned events support
- ✅ Clean, modern UI

### 🔜 Next Iterations

- 🔜 Reminders via Expo Notifications (one per event initially)
- 🔜 Milestones per event
- 🔜 Simple pinning/favorites UI
- 🔜 Settings implementation (default unit, theme)

### 🧪 Future Ideas

- Widgets / home screen shortcuts
- iCloud/Google Drive backup or sync
- More time formats and custom layouts
- Multiple reminders per event
- Advanced recurrence rules
- Export/import functionality
- Dark mode support
- Internationalization (i18n)

## Project Structure

```
src/
├── app/                    # Screen components
│   ├── HomeScreen.tsx       # Main events list
│   ├── EventDetailScreen.tsx # Event details view
│   ├── EditEventScreen.tsx  # Create/edit event form
│   └── SettingsScreen.tsx   # App settings
├── components/              # Reusable UI components
│   ├── EventCard.tsx       # Event list item
│   └── TimeSinceLabel.tsx  # Time display component
├── config/                  # Configuration and constants
│   ├── types.ts            # TypeScript type definitions
│   └── constants.ts        # App constants
├── db/                      # Database layer
│   ├── schema.ts           # Drizzle schema definitions
│   ├── client.ts           # Database connection
│   └── migrations/         # Database migrations
├── features/                # Feature modules
│   ├── events/             # Events feature
│   │   ├── types.ts        # Event types
│   │   ├── eventsService.ts # CRUD operations
│   │   └── eventsStore.ts  # Zustand store
│   ├── reminders/          # Reminders feature (coming soon)
│   └── milestones/         # Milestones feature (coming soon)
├── lib/                     # Utility functions
│   ├── formatTimeSince.ts  # Time formatting logic
│   └── __tests__/          # Unit tests
└── navigation/              # Navigation setup
    ├── AppNavigator.tsx    # Main navigator
    └── types.ts            # Navigation types
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for Mac) or Android Emulator / physical device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd since
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited support)
npm run web
```

### Running Tests

```bash
npm test
```

### Code Quality

```bash
# Lint check
npm run lint:check

# Lint and fix
npm run lint

# Format check
npm run format:check

# Format code
npm run format
```

## Roadmap

### v0.1 – Core Events + Local DB + Basic UI ✅
- [x] Database schema and setup
- [x] Event CRUD operations
- [x] Home screen with events list
- [x] Event detail screen
- [x] Create/edit event screen
- [x] Basic navigation
- [x] Time formatting logic

### v0.2 – Reminders + Milestones
- [ ] Reminder creation UI
- [ ] Expo Notifications integration
- [ ] Reminder scheduling and cancellation
- [ ] Milestone creation UI
- [ ] Milestone tracking and display
- [ ] Milestone reached notifications

### v0.3 – Design Polish + Theming
- [ ] Settings screen implementation
- [ ] Theme selection (light/dark/system)
- [ ] Default time unit configuration
- [ ] UI/UX improvements
- [ ] Icon selection for events
- [ ] Color customization

### v1.0 – Stability, Performance, Export/Backup
- [ ] Performance optimizations
- [ ] Export/import functionality
- [ ] Data backup options
- [ ] Comprehensive error handling
- [ ] Accessibility improvements
- [ ] Production-ready polish

## Architecture Guidelines

- **Business logic separation**: Keep business logic (calculations, data transformations) out of UI components
- **Type safety**: Use TypeScript types for all entities (Events, Reminders, Milestones)
- **State management**: Use Zustand for global state, local state for component-specific UI
- **Database**: All data operations go through service layers, not directly from components
- **Testing**: Unit tests for business logic, integration tests for critical flows

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

Private project - All rights reserved

