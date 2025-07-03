# MyVocab Frontend

A modern, interactive vocabulary learning application built with React and TypeScript. MyVocab helps users build and manage their personal vocabulary collection with advanced categorization, search, and filtering capabilities.

![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)

## ✨ Features

### 🔍 Vocabulary Management

- **CRUD Operations**: Create, read, update, and delete vocabulary entries
- **Rich Word Details**: Store definitions, pronunciations, examples, and context
- **Audio Pronunciation**: Play audio pronunciations for words
- **Multiple Meanings**: Support for different parts of speech and meanings

### 🏷️ Advanced Categorization

- **Custom Categories**: Create and manage custom categories with colors
- **Category Statistics**: View vocabulary counts and usage statistics
- **Colored Tags**: Visual category identification with custom colors
- **Category Filtering**: Filter vocabularies by single or multiple categories

### 🔎 Smart Search & Filtering

- **Real-time Search**: Search through your vocabulary collection
- **Category Filters**: Multi-select category filtering
- **Recent Words**: Quick access to recently added vocabularies
- **Filter Persistence**: Maintain filter state during navigation

### 👤 User Authentication

- **Secure Login/Logout**: JWT-based authentication
- **User Profile**: Display user information in header
- **Protected Routes**: Secure access to vocabulary features

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Beautiful Interface**: Modern gradient backgrounds and card layouts
- **Interactive Components**: Hover effects and smooth transitions
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui
- **State Management**: Custom React hooks
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom service layer
- **Authentication**: JWT tokens with localStorage

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API server running on `http://localhost:3000`

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd myvocab_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📖 Usage Guide

### Getting Started

1. **Login**: Access the application with your credentials
2. **Add Words**: Use the "Add Word" button to create vocabulary entries
3. **Categorize**: Assign categories to organize your vocabulary
4. **Search**: Use the search bar to find specific words
5. **Filter**: Apply category filters to narrow down results

### Adding Vocabulary

1. Click the "Add Word" button in the header or search page
2. Fill in the word details:
   - **Word**: The vocabulary term
   - **Meanings**: Multiple definitions with parts of speech
   - **Phonetic**: Pronunciation guide and audio
   - **Examples**: Usage examples with translations
   - **Categories**: Assign to existing or new categories

### Managing Categories

1. Navigate to `/categories` page
2. **Create**: Add new categories with custom colors
3. **Edit**: Modify category names and colors
4. **Delete**: Remove unused categories
5. **View Stats**: See vocabulary counts per category

### Search & Filtering

1. **Search**: Enter keywords in the search bar
2. **Category Filter**:
   - Click "Filter" button to open category panel
   - Select multiple categories for filtering
   - View filtered results in real-time
3. **Clear Filters**: Remove all applied filters

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (shadcn/ui)
│   ├── VocabularyForm.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useVocabulary.tsx
│   ├── useCategory.tsx
│   └── ...
├── pages/              # Page components
│   ├── SearchHome.tsx  # Main search and vocabulary display
│   ├── Categories.tsx  # Category management
│   ├── Login.tsx
│   └── ...
├── services/           # API service layer
│   ├── api.ts         # Base API configuration
│   ├── authService.ts
│   ├── vocabularyService.ts
│   ├── categoryService.ts
│   └── ...
├── types/              # TypeScript type definitions
│   ├── vocabulary.ts
│   ├── category.ts
│   ├── auth.ts
│   └── ...
├── layouts/            # Layout components
│   └── MainLayout.tsx
└── utils/              # Utility functions
```

## 🔌 API Integration

The frontend integrates with a REST API backend with the following endpoints:

### Authentication

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Vocabularies

- `GET /vocabularies` - Get all vocabularies
- `POST /vocabularies` - Create vocabulary
- `PUT /vocabularies/:id` - Update vocabulary
- `DELETE /vocabularies/:id` - Delete vocabulary
- `GET /vocabularies/search` - Search vocabularies

### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/search` - Search categories
- `GET /categories/stats` - Get category statistics
- `GET /categories/:id/vocabularies` - Get vocabularies by category

## 🎨 Customization

### Color Themes

Categories support custom hex colors that are applied throughout the UI:

- Category tags in vocabulary cards
- Filter panel selections
- Category management interface

### Component Styling

The application uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom colors
      },
    },
  },
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use existing component patterns
- Add proper type definitions
- Write descriptive commit messages
- Test functionality before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check existing [Issues](../../issues)
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🚀 Future Enhancements

- [ ] Offline support with PWA capabilities
- [ ] Export/Import vocabulary collections
- [ ] Spaced repetition learning system
- [ ] Vocabulary quizzes and games
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Vocabulary sharing between users

---

Made with ❤️ for language learners worldwide
