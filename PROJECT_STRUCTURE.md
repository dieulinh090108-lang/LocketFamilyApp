# LocketFamily - React Native Project Structure

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Button, Input, etc.)
│   └── specific/        # Feature-specific components
├── screens/             # Screen components
│   ├── auth/            # Authentication screens
│   ├── main/            # Main app screens
│   └── settings/        # Settings screens
├── navigation/          # Navigation configuration
├── services/            # API calls and external services
│   ├── api/             # API service functions
│   └── storage/         # Local storage utilities
├── utils/               # Utility functions
│   ├── helpers/         # General helper functions
│   └── validators/      # Validation functions
├── constants/           # App constants
│   ├── colors/          # Color definitions
│   ├── api/             # API endpoints and config
│   └── texts/           # Text constants
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── assets/              # Static assets
│   ├── images/          # Image files
│   ├── fonts/           # Font files
│   └── icons/           # Icon files
└── styles/              # Global styles and themes
```

## 🚀 Quick Start

### Import commonly used items:
```typescript
import { COLORS, Button, formatDate, isValidEmail } from '../src';
```

### Import specific modules:
```typescript
import { COLORS } from '../src/constants/colors';
import { Button } from '../src/components/common/Button';
import { formatDate } from '../src/utils/helpers';
```

## 📋 Available Components

### Button Component
```tsx
import { Button } from '../src/components';

<Button
  title="Click me"
  onPress={() => console.log('Pressed')}
  variant="primary"
  size="medium"
/>
```

## 🎨 Color System

The app uses a consistent color system defined in `src/constants/colors/index.ts`:

- `COLORS.primary` - Main brand color
- `COLORS.secondary` - Secondary actions
- `COLORS.success/error/warning` - Status colors
- `COLORS.gray*` - Neutral colors

## 🔧 Utility Functions

### Date Helpers
- `formatDate(date)` - Format date to readable string
- `formatTime(date)` - Format time
- `getTimeAgo(date)` - Relative time (e.g., "2h ago")

### Validation Helpers
- `isValidEmail(email)` - Email validation
- `isValidPassword(password)` - Password validation
- `isValidPhoneNumber(phone)` - Phone validation

### String Helpers
- `capitalize(str)` - Capitalize first letter
- `truncate(str, length)` - Truncate with ellipsis
- `removeSpecialChars(str)` - Remove special characters

## 📡 API Configuration

API settings are configured in `src/constants/api/index.ts`:

- `API_CONFIG.BASE_URL` - Base API URL
- `API_CONFIG.TIMEOUT` - Request timeout
- `API_ENDPOINTS.*` - Available endpoints

## 📝 Type Definitions

Common TypeScript interfaces are defined in `src/types/index.ts`:

- `User` - User data structure
- `Family` - Family data structure
- `MediaItem` - Media file structure
- `ApiResponse<T>` - API response wrapper

## 🏗️ Best Practices

1. **Component Structure**: Keep components small and focused
2. **File Naming**: Use PascalCase for components, camelCase for utilities
3. **Imports**: Use absolute imports from `../src` for better maintainability
4. **Types**: Define interfaces for all data structures
5. **Constants**: Centralize all magic strings and numbers
6. **Separation of Concerns**: Keep business logic separate from UI components

## 🔄 Development Workflow

1. Create new components in appropriate subfolders
2. Add types to `src/types/index.ts`
3. Add constants to relevant constant files
4. Export new items from index files
5. Use the main `src/index.ts` for clean imports

Happy coding! 🎉
