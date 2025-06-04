# Nebraska Treatment Connect

A web application designed to provide a centralized directory of adult and juvenile substance abuse and mental health residential treatment facilities in Nebraska.

## Features

### Public Features
- **Facility Search & Filtering**: Filter by age group (Adult/Juvenile), gender served (Male/Female), and treatment type (Substance Abuse/Mental Health)
- **Detailed Facility Information**: Each facility displays name, type, current availability status, address, phone, and website
- **Interactive Actions**: 
  - Get directions (opens in default map app)
  - Call facility (click-to-call functionality)
  - Visit website (opens in new tab)

### Provider Portal
- **Secure Login**: Authenticated access for facility providers
- **Status Management**: Providers can update availability status for their assigned facilities
- **Real-time Updates**: Status changes are immediately reflected in the public directory

## Application Structure

```
src/
├── index.html              # Main public-facing page
├── provider-dashboard.html  # Provider portal (demonstration)
├── styles.css              # Main stylesheet
├── scripts.js              # Main application JavaScript
├── provider-dashboard.js   # Provider portal JavaScript
├── images/                 # Directory for assets
└── README.md              # This file
```

## Demo Credentials

For testing the provider portal functionality, use these demo credentials:

**Provider 1:**
- Username: `provider1`
- Password: `password123`
- Manages: Sunrise Place, Seekers of Serenity Place

**Provider 2:**
- Username: `provider2`
- Password: `password456`
- Manages: Valley Hope of O'Neill, CenterPointe Campus for Hope

## Facility Data

The application includes comprehensive information on Nebraska residential treatment centers including:

1. **Horizon Recovery of Omaha** - Council Bluffs East
2. **Mid Plains Center for Behavioral Healthcare** - Grand Island
3. **CenterPointe** - Multiple facilities in Lincoln
4. **Bridge Behavioral Health** - Lincoln
5. **Saint Monica Behavioral Health** - Women's programs in Lincoln
6. **Nebraska Urban Indian Health Coalition** - Lincoln and Omaha locations
7. **Northpoint Nebraska** - Substance abuse treatment in Omaha
8. **Sunrise Place** - Norfolk facility with substance abuse and mental health treatment
9. **Seekers of Serenity Place** - Columbus facility offering short-term residential treatment

Plus many more facilities across Nebraska with detailed information on treatment types, populations served, and contact information.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Roboto)

## Key Features Implementation

### Search and Filtering
- Real-time filtering as users type or change filter selections
- Combination of text search and dropdown filters
- Results counter updates dynamically

### Facility Cards
- Visual status indicators with color coding:
  - Green: Openings Available
  - Red: No Openings
  - Orange: Waitlist/Accepting Assessments
  - Gray: Status Not Updated
- Responsive grid layout

### Provider Dashboard
- Secure mock authentication system
- Facility assignment based on provider credentials
- Status update forms with immediate feedback
- Timestamp tracking for status changes

### Accessibility Features
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast color scheme
- Responsive design for mobile devices

## Business Logic

### YRTC Kearney Exclusion
The application specifically excludes "YRTC Kearney" from all public listings as per requirements.

### Status Management
- Providers can only update facilities assigned to their account
- Status changes are timestamped
- Five status options available:
  - Openings Available
  - No Openings
  - Waitlist
  - Accepting Assessments
  - Emergency/Crisis Only

## Installation & Setup

1. Clone or download the project files
2. Open `index.html` in a web browser
3. No additional setup required - the application runs entirely in the browser

## Future Enhancements

This prototype demonstrates the core functionality. In a production environment, consider:

- Backend API with proper authentication
- Database integration (PostgreSQL/MySQL)
- Real user management system
- Admin panel for facility management
- Email notifications for status changes
- Advanced search capabilities
- Mobile app development
- Integration with mapping services
- Analytics and reporting features

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For questions about this application, please contact the development team.