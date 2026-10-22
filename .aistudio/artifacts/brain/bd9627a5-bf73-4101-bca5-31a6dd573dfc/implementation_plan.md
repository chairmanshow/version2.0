# Admin Course Management Implementation Plan

The objective is to enable administrators to manage courses, including creation, deletion, content updates, live class links (YouTube), and payment configuration (paid/free status).

## 1. Data Modeling
- **Firestore Collection**: `courses`
- **Fields**:
  - `title` (string)
  - `description` (string)
  - `thumbnailUrl` (string)
  - `isPaid` (boolean)
  - `paymentLink` (string, optional)
  - `youtubeLiveLink` (string, optional)
  - `liveStartTime` (timestamp, optional)
  - `content` (string)
  - `createdAt` (timestamp)

## 2. Admin UI (in `/src/pages/admin/Courses.tsx`)
- **Dashboard**: A list of existing courses with 'Edit' and 'Delete' actions.
- **Form**: A modal or separate form view for:
  - Course Title, Description, Content.
  - Thumbnail URL input.
  - Paid/Free Toggle.
  - If Paid: Payment Link input.
  - Live Class settings: YouTube Link and Start Time selector.

## 3. Implementation Steps
1. Create `src/pages/admin/Courses.tsx` reusing `AdminLayout.tsx`.
2. Define Firestore CRUD operations for the `courses` collection using `firebase-integration-rpc`.
3. Build the Course Management UI with Tailwind CSS.
4. Implement form submission to Firestore.
5. Integrate with existing admin navigation.

## 4. Verification
- Validate course creation/deletion in Firestore.
- Check thumbnail rendering and link functionality.
- Test YouTube live link playback in the course view (user-facing side, subsequent task).
