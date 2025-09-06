# FosterLinks Theme Management System

## Overview

The FosterLinks application features a comprehensive, cross-platform theme management system that allows agencies to customize the application's appearance to match their branding. The system provides centralized theme management with real-time updates across React Web, Swift iOS, and FlutterFlow Android applications.

## Features

### 🎨 Dynamic Theming
- **Light/Dark/System Mode**: Automatic theme switching based on user preference or system settings
- **Custom Brand Colors**: Primary and secondary color customization with preset options
- **Agency Logo Upload**: Custom logo support with cloud storage integration
- **Real-time Preview**: Live preview of theme changes before applying
- **Smooth Animations**: Subtle transitions and animations for modern UI feel

### 🔄 Cross-Platform Sync
- **Firestore Integration**: Theme preferences stored in Firestore for cross-platform consistency
- **Real-time Updates**: Changes sync instantly across all user devices
- **Offline Support**: Theme settings cached locally for offline access

### 🛡️ Enterprise Features
- **Role-based Access**: Different customization levels based on user roles
- **Agency Branding**: Logo and color scheme customization for white-label deployment
- **Compliance Ready**: Meets accessibility standards with proper contrast ratios

## Architecture

### React Web Application

#### Core Components

1. **ThemeContext** (`src/contexts/ThemeContext.tsx`)
   - Manages global theme state
   - Integrates with Material-UI theming system
   - Handles Firestore synchronization
   - Provides theme update methods

2. **ThemeSettings** (`src/components/ThemeSettings.tsx`)
   - User interface for theme customization
   - Color picker with preset options
   - Logo upload functionality
   - Real-time preview

3. **ThemePreview** (`src/components/ThemePreview.tsx`)
   - Interactive preview of theme changes
   - Mock UI components showing theme application
   - Responsive design preview

4. **NavigationBar** (`src/components/NavigationBar.tsx`)
   - Displays agency logo when uploaded
   - Uses theme colors for branding
   - Responsive design with mobile drawer

#### Theme Structure

```typescript
interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  logoName?: string;
}
```

#### Usage Example

```tsx
import { useAppTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { themeSettings, updateThemeSettings } = useAppTheme();
  
  const handleColorChange = async (newColor: string) => {
    await updateThemeSettings({
      ...themeSettings,
      primaryColor: newColor
    });
  };
  
  return (
    <Button 
      sx={{ backgroundColor: themeSettings.primaryColor }}
      onClick={() => handleColorChange('#ff5722')}
    >
      Change Theme
    </Button>
  );
};
```

### Swift iOS Application

#### Core Components

1. **ThemeManager** (`SwiftImplementation/ThemeManager.swift`)
   - ObservableObject for theme state management
   - Firestore integration for cross-platform sync
   - Color utility functions
   - Preset color options

2. **ThemeSettingsView** (`SwiftImplementation/ThemeSettingsView.swift`)
   - SwiftUI interface for theme customization
   - Color picker with visual feedback
   - Theme preview section
   - Settings persistence

3. **FosterLinksApp** (`SwiftImplementation/FosterLinksApp.swift`)
   - Main app entry point
   - Theme manager initialization
   - Environment object injection

#### Theme Structure

```swift
class ThemeManager: ObservableObject {
    @Published var primaryColor: Color
    @Published var secondaryColor: Color
    @Published var isDarkMode: Bool
    @Published var logoURL: String?
}
```

#### Usage Example

```swift
struct MyView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button("Action") {
            // Handle action
        }
        .foregroundColor(.white)
        .background(themeManager.primaryColor)
        .cornerRadius(8)
    }
}
```

## Color Presets

### Primary Colors
- **Blue**: `#1976d2` (Default)
- **Purple**: `#9c27b0`
- **Green**: `#2e7d32`
- **Orange**: `#ed6c02`
- **Red**: `#d32f2f`
- **Teal**: `#00796b`
- **Indigo**: `#3949ab`

### Secondary Colors
- **Pink**: `#dc004e` (Default)
- **Mint**: `#00bcd4`
- **Yellow**: `#fbc02d`
- **Cyan**: `#00acc1`
- **Brown**: `#5d4037`
- **Gray**: `#616161`

## Firestore Schema

### Collection: `themes`
```json
{
  "userId": {
    "primaryColor": "#1976d2",
    "secondaryColor": "#dc004e",
    "mode": "light",
    "logoUrl": "https://storage.googleapis.com/...",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Collection: `logos` (Firebase Storage)
```
logos/
  ├── {userId}/
  │   └── logo (image file)
```

## Setup Instructions

### React Web Setup

1. **Install Dependencies**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   npm install firebase
   ```

2. **Configure Firebase**
   - Enable Firestore
   - Enable Firebase Storage
   - Set up security rules

3. **Wrap App with ThemeProvider**
   ```tsx
   import { ThemeProvider } from './contexts/ThemeContext';
   
   function App() {
     return (
       <ThemeProvider>
         <YourAppContent />
       </ThemeProvider>
     );
   }
   ```

### Swift iOS Setup

1. **Add Firebase Dependencies**
   ```swift
   // Package.swift or Xcode Package Manager
   .package(url: "https://github.com/firebase/firebase-ios-sdk", from: "10.0.0")
   ```

2. **Configure Firebase**
   - Add GoogleService-Info.plist
   - Initialize Firebase in AppDelegate

3. **Inject ThemeManager**
   ```swift
   @main
   struct FosterLinksApp: App {
       @StateObject private var themeManager = ThemeManager()
       
       var body: some Scene {
           WindowGroup {
               ContentView()
                   .environmentObject(themeManager)
           }
       }
   }
   ```

## FlutterFlow Integration

### App State Variables
1. Create App State variables:
   - `primaryColor` (Color)
   - `secondaryColor` (Color)
   - `isDarkMode` (Boolean)
   - `logoUrl` (String)

### Firestore Integration
1. **Read Theme on Login**:
   ```dart
   // Custom Action: Load Theme
   Future loadUserTheme() async {
     final doc = await FirebaseFirestore.instance
         .collection('themes')
         .doc(currentUserUid)
         .get();
     
     if (doc.exists) {
       FFAppState().primaryColor = Color(int.parse(doc.data()!['primaryColor'].substring(1), radix: 16));
       FFAppState().secondaryColor = Color(int.parse(doc.data()!['secondaryColor'].substring(1), radix: 16));
       FFAppState().isDarkMode = doc.data()!['mode'] == 'dark';
     }
   }
   ```

2. **Save Theme Changes**:
   ```dart
   // Custom Action: Save Theme
   Future saveUserTheme() async {
     await FirebaseFirestore.instance
         .collection('themes')
         .doc(currentUserUid)
         .set({
       'primaryColor': '#${FFAppState().primaryColor.value.toRadixString(16).substring(2)}',
       'secondaryColor': '#${FFAppState().secondaryColor.value.toRadixString(16).substring(2)}',
       'mode': FFAppState().isDarkMode ? 'dark' : 'light',
       'updatedAt': FieldValue.serverTimestamp(),
     });
   }
   ```

### Theme Settings Page
1. Create a settings page with:
   - Color picker widgets
   - Dark mode toggle
   - Logo upload component
   - Preview section

2. Bind widgets to App State variables
3. Call save action on changes

## Best Practices

### Performance
- **Debounce Updates**: Avoid excessive Firestore writes during color picker interactions
- **Local Caching**: Cache theme settings locally for faster app startup
- **Lazy Loading**: Load theme assets only when needed

### Accessibility
- **Contrast Ratios**: Ensure sufficient contrast between text and background colors
- **Color Blindness**: Provide alternative visual indicators beyond color
- **System Preferences**: Respect user's system-wide accessibility settings

### Security
- **Storage Rules**: Implement proper Firebase Storage security rules
- **User Isolation**: Ensure users can only access their own theme data
- **File Validation**: Validate uploaded logo files for security

### User Experience
- **Smooth Transitions**: Use animations for theme changes
- **Preview Mode**: Allow users to preview changes before applying
- **Reset Option**: Provide easy way to reset to default theme
- **Responsive Design**: Ensure theme works across all screen sizes

## Troubleshooting

### Common Issues

1. **Theme Not Syncing**
   - Check Firestore security rules
   - Verify user authentication
   - Check network connectivity

2. **Logo Not Displaying**
   - Verify Firebase Storage configuration
   - Check file upload permissions
   - Validate image URL accessibility

3. **Colors Not Applying**
   - Ensure theme context is properly wrapped
   - Check for component-specific style overrides
   - Verify color format (hex vs rgb)

### Debug Tools

1. **React DevTools**: Inspect theme context state
2. **Firebase Console**: Monitor Firestore operations
3. **Network Tab**: Check API calls and responses
4. **Console Logs**: Enable debug logging for theme operations

## Future Enhancements

### Planned Features
- **Advanced Color Schemes**: Support for gradient backgrounds and accent colors
- **Typography Customization**: Font family and size options
- **Component Themes**: Individual component styling options
- **Theme Templates**: Pre-built theme packages for different industries
- **A/B Testing**: Theme variation testing for user engagement
- **Analytics Integration**: Track theme usage and preferences

### Technical Improvements
- **Performance Optimization**: Reduce bundle size and improve loading times
- **Offline Support**: Enhanced offline theme management
- **Version Control**: Theme versioning and rollback capabilities
- **Bulk Operations**: Admin tools for managing multiple agency themes

## Support

For technical support or feature requests related to the theme system:

1. **Documentation**: Check this guide and inline code comments
2. **Issues**: Create GitHub issues for bugs or feature requests
3. **Community**: Join our developer community for discussions
4. **Professional Support**: Contact our team for enterprise support

---

*Last updated: January 2024*
*Version: 1.0.0*