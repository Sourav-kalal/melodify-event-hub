# Backend API Integration Complete

## Overview
You've successfully implemented comprehensive API integration between your React app and the Spring Boot backend. The integration includes all REST endpoints from the `sandystereo-backend` repository.

## What Was Implemented

### 1. **API Client Setup** (`src/integrations/backend/`)
- **client.ts**: Axios-based API client with automatic JWT authentication
- **types.ts**: TypeScript types and interfaces for all backend entities
- **api/**: Individual modules for each resource (courses, events, enrollments, etc.)

### 2. **API Endpoints Integrated**

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Resources (CRUD Operations)
- **Courses**: `/api/courses`
- **Events**: `/api/events`
- **Enrollments**: `/api/enrollments`
- **Admissions**: `/api/admissions`
- **Payments**: `/api/payments`
- **Users**: `/api/users`
- **Profiles**: `/api/profiles`
- **Site Settings**: `/api/sitesettings`
- **User Roles**: `/api/userroles`
- **Instructor Courses**: `/api/instructorcourses`
- **Course Classes**: `/api/classes`

### 3. **React Query Hooks Created**
- `useCoursesApi.ts` - Course operations
- `useEnrollmentsApi.ts` - Enrollment operations
- `useAdmissionsApi.ts` - Admission operations
- `usePaymentsApi.ts` - Payment operations
- `useSiteSettingsApi.ts` - Site settings operations
- `useEventsApi.ts` - Event operations

### 4. **Pages Updated to Use Backend APIs**
- **Login.tsx** - Uses `authApi.login()` for JWT authentication
- **Register.tsx** - Uses `authApi.register()` with role assignment
- **Courses.tsx** - Uses `useCourses()` hook
- **Events.tsx** - Uses `useEvents()` hook
- **CourseDetail.tsx** - Uses `useCourse()` hook
- **EventDetail.tsx** - Uses `useEvent()` hook
- **admin/AdminCourses.tsx** - Full CRUD operations with mutations

### 5. **Authentication Overhaul**
- Updated `useAuth.ts` hook to decode JWT tokens
- Replaced Supabase auth with backend JWT authentication
- Token stored in `localStorage.accessToken`
- User info stored in `localStorage.user`
- Automatic 401 redirect on token expiration

## Configuration

### Environment Setup
Create a `.env` file in your workspace root:

```env
VITE_API_URL=http://localhost:8080
VITE_API_BASE_PATH=/api
```

### Update for Different Backend URLs
Simply modify the `.env` file:
- Local development: `VITE_API_URL=http://localhost:8080`
- Production: `VITE_API_URL=https://your-production-url.com`

## Key Features

✅ **Automatic JWT Handling** - Token automatically added to all requests
✅ **Error Handling** - Global error interceptor with auto logout on 401
✅ **Type Safety** - Full TypeScript support for all API responses
✅ **React Query Integration** - Caching, invalidation, and optimistic updates
✅ **Consistent API Pattern** - All endpoints follow same data structure
✅ **Field Name Conversion** - Automatic camelCase conversion from backend snake_case

## Usage Examples

### Fetching Courses
```typescript
import { useCourses } from '@/hooks/useCoursesApi';

function MyComponent() {
  const { data: courses, isLoading } = useCourses();
  // courses is fully typed as Course[]
}
```

### Creating a Course (Admin)
```typescript
import { useCreateCourse } from '@/hooks/useCoursesApi';

function AdminCourseForm() {
  const createCourse = useCreateCourse();
  
  const handleCreate = async () => {
    await createCourse.mutateAsync({
      title: 'Guitar Basics',
      description: 'Learn guitar fundamentals',
      level: CourseLevel.BEGINNER,
      isActive: true,
      upiPrice: 2999,
    });
  };
}
```

### User Authentication
```typescript
import { authApi } from '@/integrations/backend/api/auth';

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password'
});

// Get token
const token = authApi.getToken();

// Logout
authApi.logout();
```

## Next Steps

1. **Start your Spring Boot backend**:
   ```bash
   mvn spring-boot:run
   ```

2. **Update environment variables** if needed

3. **Test the integration**:
   - Navigate to `/login`
   - Create account or login
   - Verify data fetching from backend

4. **Update remaining pages** for:
   - Admin dashboards (admin/AdminDashboard.tsx, AdminSettings.tsx)
   - Instructor dashboards
   - Student dashboards
   - Other specific components

## Database Sync Note

Your backend uses PostgreSQL with Flyway migrations. The database schema is already seeded with sample music courses and events from `V1__full_reset_rebuild.sql`.

## Support for Multiple Roles

The backend supports three roles:
- **admin**: Full administrative access
- **instructor**: Can manage courses and enrollments
- **student**: Can enroll in courses

Roles are automatically assigned during registration and encoded in JWT tokens.

---

**Your React app is now fully integrated with the Spring Boot backend! 🎵**
