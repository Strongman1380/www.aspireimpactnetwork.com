# YOUWARE Development Guide

## Project Overview
Recovery Connect is a comprehensive mental health and addiction recovery support platform featuring:
- **Recovery Tools**: Interactive assessments, trackers, meditation guides, journals, and planners
- **Resource Library**: Curated mental health resources with filtering and search
- **Peer Mentorship**: Mentor matching and communication system
- **Community Support**: Crisis support resources and community guidelines
- **Content Management**: User story sharing and moderation
- **AI Recovery Companion**: Interactive AI chat support using Aminos AI chat bot

## Architecture & Technology Stack

### Frontend Framework
- Pure HTML5/CSS3/JavaScript (no frameworks)
- Brutal design system with CSS custom properties
- Mobile-responsive with CSS Grid and Flexbox
- Progressive enhancement approach

### Design System
- **Colors**: Teal (#06b6d4), Coral (#f97316), Amber (#f59e0b), Purple (#8b5cf6)
- **Typography**: Figtree (headings), JetBrains Mono (code/data)
- **Shadows**: Brutal box-shadows (8px 8px 0px #0f172a)
- **Borders**: 3-4px solid borders throughout
- **Animations**: CSS transitions and keyframe animations

### Data Management
- **Local Storage**: All user data persists in localStorage
- **Data Structure**: JSON objects with versioning support
- **Export/Import**: JSON file-based data portability
- **Privacy**: No external data transmission (offline-first)

## File Structure & Components

### Core Pages
- `index.html` - Landing page with hero, features, and community chat
- `recovery-tools.html` - Tool directory with filtering and search
- `resource-library.html` - Resource database with categorization
- `peer-mentorship.html` - Mentor profiles and matching system
- `crisis-support.html` - Emergency resources and crisis intervention
- `recovery-companion-demo.html` - AI-powered recovery companion using Claude AI

### Recovery Tools
- `assessment-pandemic.html` - Post-pandemic mental health assessment (10 questions, scoring system)
- `tracker-sobriety.html` - Daily sobriety tracking with milestones and calendar view
- `meditation-guide.html` - Guided meditation sessions with breathing exercises
- `journal-template.html` - Daily journaling with mood tracking and triggers
- `planner-weekly.html` - Weekly planning with goals, appointments, and self-care

### Supporting Pages
- `community-guidelines.html` - Platform rules and moderation guidelines
- `privacy-policy.html` - Privacy policy and data handling
- `terms-of-service.html` - Terms of use and legal information
- `stories.html` - User story sharing and testimonials

## Development Commands

### Local Development
```bash
# Serve locally (any static server)
python -m http.server 8000
# or
npx live-server

# Access at http://localhost:8000
```

### File Management
- No build process required
- Direct file editing and refresh
- All assets must be relative paths
- Images should be optimized for web

### Aminos AI Chat Bot Integration
- AI chat functionality is implemented via the Aminos AI chat bot service
- Required script in the header of every page:
  ```html
  <script src="https://app.aminos.ai/js/chat_plugin.js" data-bot-id="52714"></script>
  ```
- The chat bot automatically appears on all pages
- No additional configuration required as the bot is managed through the Aminos platform
- Previous AI SDK-based implementation has been removed

## Recovery Tools Implementation

### Assessment Tools
- **Scoring Algorithm**: Sum-based scoring with thresholds
- **Results Display**: Color-coded feedback with recommendations
- **Data Persistence**: localStorage with timestamp tracking
- **Progress Tracking**: Historical results comparison

### Tracking Tools
- **Calendar Integration**: Visual progress representation
- **Milestone System**: Predefined achievement thresholds
- **Export Functionality**: JSON data export for backup
- **Streak Calculation**: Consecutive day tracking logic

### Meditation Tools
- **Timer System**: JavaScript-based meditation timers
- **Breathing Guides**: Visual and audio breathing cues
- **Progress Analytics**: Session duration and frequency tracking
- **Background Sounds**: Audio integration for ambiance

### Planning Tools
- **Weekly Grid**: 7-day calendar view with event management
- **Goal Tracking**: Checkbox-based completion system
- **Self-Care Lists**: Predefined wellness activities
- **Statistics Dashboard**: Completion rate visualization

## Data Models

### User Progress Tracking
```javascript
{
  assessments: {
    [date]: { score, answers, timestamp }
  },
  sobriety: {
    startDate, currentStreak, dailyRecords
  },
  meditation: {
    totalSessions, totalMinutes, sessionHistory
  },
  journal: {
    entries: { [date]: { mood, content, triggers } }
  }
}
```

### Tool Configuration
```javascript
{
  questions: [{ question, options: [{ text, value }] }],
  thresholds: { low: 7, moderate: 15, high: 30 },
  recommendations: { [level]: [string] }
}
```

## Styling Conventions

### Component Structure
- Container → Section → Card → Content hierarchy
- Consistent padding/margin scale (1rem, 2rem, 3rem)
- Brutal shadows on interactive elements
- 3-4px borders for definition

### Responsive Breakpoints
- Mobile: `@media (max-width: 768px)`
- Tablet: `@media (max-width: 1024px)`
- Grid auto-fit with minmax for flexible layouts

### Animation Patterns
- Hover transforms: `translate(-2px, -2px)`
- Box-shadow increases on interaction
- Smooth transitions (0.3s ease)
- Loading animations for data operations

## Browser Compatibility

### Supported Features
- CSS Grid and Flexbox
- CSS Custom Properties
- Local Storage API
- ES6 JavaScript features
- Web APIs (File, Blob, URL)
- Aminos AI chat bot integration

### Fallbacks
- Graceful degradation for older browsers
- Progressive enhancement approach
- Feature detection before usage
- Fallback responses for AI when API is unavailable

## Security & Privacy

### Data Handling
- No external API calls for user data
- Local storage encryption consideration
- Input sanitization for user content
- XSS prevention in dynamic content

### Content Security
- No inline scripts in production
- Validated user inputs
- Safe HTML generation patterns

## Performance Optimization

### Loading Strategies
- Critical CSS inlined
- Progressive image loading
- Lazy loading for non-critical content
- Minimal JavaScript dependencies

### Storage Management
- Data compression for localStorage
- Cleanup of old entries
- Export options for data portability

## Testing Guidelines

### Manual Testing
- Cross-browser compatibility testing
- Mobile device responsiveness
- Touch interaction validation
- Accessibility compliance (WCAG 2.1)

### Data Integrity
- LocalStorage persistence testing
- Export/import validation
- Edge case handling (empty states)
- Data migration scenarios

## Mental Health Considerations

### Crisis Support
- Clear emergency contact information
- Crisis intervention resource links
- Professional help recommendations
- Immediate help accessibility

### Content Guidelines
- Trauma-informed design principles
- Positive language and messaging
- Clear disclaimers about professional help
- Safe space creation for vulnerable users

### Accessibility
- Screen reader compatibility
- High contrast mode support
- Keyboard navigation
- Clear content hierarchy

## Common Development Tasks

### Adding New Assessment Tools
1. Create new HTML file with assessment structure
2. Implement question array and scoring logic
3. Add result interpretation and recommendations
4. Integrate with main tools page
5. Update navigation and routing

### Implementing Data Export
1. Gather relevant localStorage data
2. Structure JSON export format
3. Create downloadable blob
4. Add user feedback and confirmation

### Adding Progress Tracking
1. Define data structure for metrics
2. Implement calculation logic
3. Create visual representation (charts/graphs)
4. Add historical comparison features

### Script Management
1. Aminos AI chat bot script is the only required script for chat functionality
2. The custom AI implementation using `recovery-assistant.js` has been removed
3. Ensure the Aminos script is placed in the header of all HTML pages
4. No additional configuration is needed for the chat bot to function

## Deployment Considerations

### Static Hosting
- Compatible with any static file server
- No server-side processing required
- CDN-friendly architecture
- Fast loading optimized

### Asset Management
- Relative path usage mandatory
- Image optimization required
- Font loading optimization
- Minimal external dependencies

## Future Enhancements

### Potential Integrations
- Calendar app synchronization
- Health tracking device integration
- Peer communication features
- Professional provider directory

### Advanced Features
- Offline functionality enhancement
- Data synchronization capabilities
- Advanced analytics and insights
- Customizable tool configurations

This codebase prioritizes user privacy, accessibility, and effective mental health support through a clean, maintainable architecture that can be easily extended and customized.