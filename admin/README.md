# NearVibe Admin Dashboard

A beautiful, modern admin dashboard for managing NearVibe events, users, and organisers.

## Features

### Dashboard

- **Real-time Statistics**: Total events, pending approvals, user count, verified users
- **Event Analytics**: Visual charts for event types and city distribution
- **Trend Analysis**: Check-in trends and user engagement metrics

### Event Management

- View all pending events awaiting approval
- Approve or reject events with a single click
- Event details including location, date, and description

### Organiser Management

- Manage organiser registration requests
- Approve or reject organiser applications
- View organiser details and history

### User Management

- Browse all registered users
- View trust scores and verification status
- Track user engagement and activity

### Analytics Dashboard

- Event popularity trends over time
- User engagement metrics
- Verification rate tracking
- Trust score distribution

## Design System

### Color Palette

- **Primary Gradient**: Pink (#ec4899) → Purple (#8b5cf6) → Cyan (#06b6d4)
- **Background**: Slate 950 with gradient overlay
- **Accent**: Purple (#8b5cf6) for interactive elements
- **Success**: Emerald (#10b981)
- **Danger**: Red (#ef4444)

### Visual Effects

- **Glass-morphism**: Frosted glass cards with backdrop blur
- **Smooth Transitions**: 0.3s ease transitions on all interactive elements
- **Animated Backgrounds**: Floating orbs with gradient colors
- **Responsive Grid**: Auto-fitting cards with gap spacing

## Getting Started

### Prerequisites

- Backend API running on `http://localhost:5000`
- Valid admin credentials

### Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

### Login

Navigate to `/login.html` and use admin credentials:

- Email: admin@nearvibe.com
- Password: admin123

## File Structure

```
admin/
├── index.html       # Main dashboard
├── login.html       # Login page
├── package.json     # Dependencies
└── README.md        # This file
```

## API Integration

The dashboard communicates with the NearVibe backend API:

### Authentication

```javascript
// All requests include Bearer token
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Endpoints Used

- `GET /api/events` - List all events
- `POST /api/admin/events/:id/approve` - Approve event
- `POST /api/admin/events/:id/reject` - Reject event
- `GET /api/admin/organisers` - List organisers
- `POST /api/admin/organisers/:id/approve` - Approve organiser

## Customization

### Colors

Edit the CSS variables in the `<style>` section:

```css
.gradient-text {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%);
}
```

### Sidebar Navigation

Add new menu items in the sidebar:

```html
<a
  href="#"
  onclick="switchPage('newpage')"
  class="sidebar-link"
  id="nav-newpage"
>
  <span style="font-size: 20px; margin-right: 12px;">📱</span>
  <span>New Page</span>
</a>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

ISC

## Support

For issues or feature requests, contact the development team.
