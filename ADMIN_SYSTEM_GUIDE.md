# Admin System Guide

## Overview

The MyVocab admin system provides comprehensive management capabilities for administrators to oversee users, vocabularies, and categories. This system includes role-based access control and a dedicated admin dashboard.

## Features

### 🔐 Authentication & Authorization

- **Role-based access control** with `USER` and `ADMIN` roles
- **Automatic redirection** - non-admin users cannot access admin routes
- **Admin header link** - Only visible to administrators

### 📊 Admin Dashboard (`/admin`)

- **System statistics** overview
- **Quick action cards** for user, vocabulary, and category management
- **Recent activity** feed
- **Performance metrics** and growth indicators

### 👥 User Management (`/admin/users`)

- **User listing** with search and role filtering
- **User details** including registration date, last login, vocabulary count
- **Role management** - promote/demote users to admin
- **Account actions** - edit, email, delete users
- **User statistics** - total users, admins, unverified accounts

### 📚 Vocabulary Management (`/admin/vocabularies`)

- **Comprehensive vocabulary listing** with search and category filters
- **Author tracking** - see who created each vocabulary
- **Bulk operations** for vocabulary management
- **Vocabulary statistics** - total count, categories used, audio availability
- **Quick actions** - view, edit, delete vocabularies

### 📂 Category Management (`/admin/categories`)

- **Category overview** with color-coded organization
- **Usage statistics** and vocabulary distribution
- **Visual usage charts** showing category popularity
- **Category actions** - edit colors, view vocabularies, delete categories
- **Smart deletion** - warnings for categories with existing vocabularies

## Getting Started

### Prerequisites

- User account with `ADMIN` role
- Backend API running with admin endpoints

### Accessing Admin Dashboard

1. **Login** with admin credentials
2. **Look for "Admin" link** in the header navigation
3. **Click "Admin"** to access the dashboard at `/admin`

### Admin Navigation

The admin system uses a dedicated layout with:

- **Sidebar navigation** (desktop)
- **Mobile-responsive** hamburger menu
- **Breadcrumb navigation** for easy orientation
- **Quick logout** from admin panel

## Admin Routes

```
/admin                    # Dashboard overview
/admin/users             # User management
/admin/vocabularies      # Vocabulary management
/admin/categories        # Category management
```

## Role Management

### User Roles

- **USER** - Standard user with basic vocabulary features
- **ADMIN** - Administrator with full system access

### Setting Up Admin Users

Currently, admin users must be set up through the backend API. The frontend admin system will display admin controls once a user has the `ADMIN` role.

## Features in Detail

### Dashboard Statistics

- **Total Users** - All registered users
- **Total Vocabularies** - All vocabulary entries
- **Total Categories** - All category entries
- **Recent Activity** - Latest system activities

### User Management Features

- **Search** users by username or email
- **Filter** by role (All, Users, Admins)
- **Role toggle** - Switch between USER and ADMIN roles
- **User statistics** - Vocabulary count, registration date, last login
- **Bulk actions** - Future feature for multiple user operations

### Vocabulary Management Features

- **Search** vocabularies by word or meaning
- **Filter** by category
- **Author information** - See who created each vocabulary
- **Rich vocabulary display** - Word, phonetic, meanings, categories
- **Statistics** - Total count, categories used, audio availability

### Category Management Features

- **Color-coded** category display
- **Usage statistics** - Number of vocabularies per category
- **Visual charts** - Category usage distribution
- **Smart deletion** - Warnings for categories in use
- **Category details** - Creation date, author, vocabulary count

## Security Features

### Access Control

- **Route protection** - Admin routes require ADMIN role
- **Automatic redirects** - Non-admin users redirected to home
- **Role checking** - Admin links only visible to admins

### Data Protection

- **Confirmation dialogs** for destructive actions
- **Smart warnings** for category deletion with existing vocabularies
- **Audit trail** - Creator and modification tracking

## Mobile Responsiveness

The admin system is fully responsive with:

- **Mobile sidebar** with hamburger menu
- **Responsive grids** for cards and tables
- **Touch-friendly** buttons and actions
- **Optimal viewing** on all device sizes

## Future Enhancements

### Planned Features

- [ ] **Real API integration** - Replace mock data with backend calls
- [ ] **Bulk operations** - Multiple user/vocabulary actions
- [ ] **Advanced filtering** - Date ranges, status filters
- [ ] **Export functionality** - Data export for reports
- [ ] **Activity logging** - Detailed admin action logs
- [ ] **User communication** - Email users from admin panel
- [ ] **Statistics dashboard** - Advanced analytics and charts
- [ ] **Role permissions** - Fine-grained permission system

### Technical Improvements

- [ ] **Caching** - Improve performance with data caching
- [ ] **Pagination** - Handle large datasets efficiently
- [ ] **Real-time updates** - Live data updates
- [ ] **Notifications** - Admin notification system

## Troubleshooting

### Common Issues

**Admin link not showing?**

- Ensure your user has `ADMIN` role
- Check that you're logged in
- Refresh the page to reload user data

**Cannot access admin routes?**

- Verify your user role in the user data
- Check browser console for errors
- Ensure you're authenticated

**Data not loading?**

- Currently using mock data - real API integration pending
- Check browser console for JavaScript errors
- Verify development server is running

### Getting Help

For technical issues:

1. Check browser developer console
2. Verify user role and authentication
3. Contact system administrator

## Development Notes

### Current Implementation

- **Frontend-only** admin system with mock data
- **Role-based access** control implemented
- **Responsive design** with Tailwind CSS
- **TypeScript** for type safety

### API Integration

The admin system is designed to work with backend APIs:

- User management: `/api/admin/users`
- Vocabulary management: `/api/admin/vocabularies`
- Category management: `/api/admin/categories`
- Statistics: `/api/admin/stats`

### Architecture

- **Layout-based** routing with `AdminLayout`
- **Component-driven** design with reusable UI components
- **Hook-based** state management
- **Service layer** for API communication

---

**Built with ❤️ for efficient vocabulary app administration**
