

## Summary of Changes

This plan covers multiple requests: replacing course card buttons with an inline enrollment form (matching the uploaded admission form design), updating contact info, adding a sample event, fixing auth persistence, removing instructor self-registration, and providing SQL to create an admin user.

---

## 1. Enroll Now -- Inline Admission Form (Dialog)

**What changes:** Clicking "Enroll Now" on a course card opens a modal/dialog with an admission form matching the uploaded PDF, minus the "Instrument" radio (since the course is already known).

**Form fields:**
- Name of Applicant (required)
- Date of Birth (required)
- Gender -- radio: Male / Female / Prefer not to say (required)
- Father Name (required)
- Mother Name (required)
- Email (required)
- Phone Number (required)
- Address (required)
- Photo upload (required, max 10MB)
- Class Mode -- radio: Online / Offline (required)
- Pick a suitable batch (Offline) -- radio: 4pm-5pm / 5pm-6pm / 6pm-7pm (conditionally required when Offline)
- Referral Code (optional)

**New files:**
- `src/components/courses/EnrollmentFormDialog.tsx` -- Dialog with the form, submits data to a new `admissions` table

**Database migration:**
- Create `admissions` table with all the form fields plus `course_id`, `user_id` (nullable for anonymous submissions), and `status` (default: 'pending')
- Create a storage bucket `admission-photos` for photo uploads
- RLS: anyone can insert, admins can read all

**Edited files:**
- `src/components/courses/CourseCard.tsx` -- Remove WhatsApp and Join Now buttons, keep only "Enroll Now" which opens the dialog

## 2. Remove WhatsApp and Join Now Buttons from Course Cards

**Files edited:**
- `src/components/courses/CourseCard.tsx` -- Remove the WhatsApp button and Join Now button; only "Enroll Now" remains

## 3. Update Contact Number

**Files edited:**
- `src/components/layout/Footer.tsx` -- Change phone from `+91 98765 43210` to `+91 86600 46713` and email from `info@sangeetacademy.com` to something appropriate

## 4. Add "Learn Guitar in 15 Days" Event

**Action:** Insert a new event into the `events` table via SQL:
- Name: "Learn Guitar in 15 Days -- Crash Course Workshop"
- Description: A 15-day intensive guitar workshop covering chords, strumming, fingerpicking, and popular songs
- Event date: ~1 month from now
- is_active: true

## 5. Fix Login State Persistence

The `useAuth` hook already uses `onAuthStateChange` and `persistSession: true`. The issue is likely that the Navbar always shows Login/Register buttons regardless of auth state.

**Files edited:**
- `src/components/layout/Navbar.tsx` -- Use the `useAuth` hook to conditionally show Login/Register OR a user menu with dashboard link and sign out

## 6. Remove Instructor Self-Registration

**Files edited:**
- `src/pages/Register.tsx` -- Remove the role selection step entirely. Registration always creates a "student" role. No instructor option shown.

## 7. Update Remaining "Sangeet Academy" References

**Files edited:**
- `src/pages/Login.tsx` -- Change logo text to "Sandy's Stereo" with subtitle
- `src/pages/Register.tsx` -- Same branding update

## 8. SQL to Create Admin User

Provide the user with SQL commands to run manually:

```text
-- After a user registers normally, promote them to admin:
-- 1. Find the user's ID from auth.users by email
-- 2. Insert or update their role in user_roles

INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL_HERE'),
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;
```

The user will need to:
1. Register a normal student account with their desired admin email
2. Run the SQL above in the backend's SQL editor (replacing the email)

---

## Technical Details

### New Database Table: `admissions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| course_id | uuid | FK to courses |
| user_id | uuid | nullable, FK to auth.users |
| applicant_name | text | required |
| date_of_birth | text | required |
| gender | text | required |
| father_name | text | required |
| mother_name | text | required |
| email | text | required |
| phone_number | text | required |
| address | text | required |
| photo_url | text | nullable |
| class_mode | text | 'online' or 'offline' |
| preferred_batch | text | nullable |
| referral_code | text | nullable |
| status | text | default 'pending' |
| created_at | timestamptz | default now() |

### Storage Bucket
- `admission-photos` -- public read, authenticated insert

### Files Created
- `src/components/courses/EnrollmentFormDialog.tsx`

### Files Modified
- `src/components/courses/CourseCard.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/pages/Register.tsx`
- `src/pages/Login.tsx`

