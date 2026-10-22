# Courses Management System Implementation Plan

The objective is to implement a comprehensive Courses system where admins can manage content, and users can purchase and view courses.

## 1. Database Schema (Firestore)
- **Courses Collection**:
  - `id`: string
  - `title`: string
  - `description`: string
  - `thumbnailUrl`: string
  - `price`: number (0 for free)
  - `isPaid`: boolean
  - `videoUrl`: string (YouTube unlisted link)
  - `liveClassLink`: string (optional)
  - `liveClassTime`: timestamp (optional)
  - `createdAt`: timestamp

## 2. Admin Dashboard
- Create `/src/pages/admin/CoursesDashboard.tsx` for authorized admins.
- CRUD operations for courses:
  - Create/Update course form (with thumbnail upload support using Firebase Storage).
  - Delete course functionality.
  - Manage course pricing and type (Free/Paid).

## 3. Course Viewing
- Create `/src/pages/CoursesPage.tsx` for users to browse available courses.
- Create `/src/pages/CourseDetail.tsx` for viewing course content, video embedding, and live session links.

## 4. Payment Integration
- Implement Razorpay integration in the course checkout process.
- Create a protected route for paid content access upon successful payment.

## 5. Security & Auth
- Implement basic admin authorization check for the admin dashboard.
- Firebase Authentication for user login/tracking purchases.
