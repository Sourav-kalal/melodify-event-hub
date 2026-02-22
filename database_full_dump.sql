-- ============================================================
-- Sandy's Stereo - Complete Database Schema & Data
-- Generated: 2026-02-22
-- ============================================================

-- ==================== ENUMS ====================

CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');
CREATE TYPE public.course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- ==================== FUNCTIONS ====================

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- ==================== TABLES ====================

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  level course_level NOT NULL DEFAULT 'Beginner',
  duration text,
  is_active boolean NOT NULL DEFAULT true,
  google_form_link text,
  whatsapp_number text,
  upi_price numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  banner_url text,
  google_form_link text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enrollments
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id),
  enrolled_at timestamptz NOT NULL DEFAULT now()
);

-- Admissions
CREATE TABLE public.admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id),
  user_id uuid,
  applicant_name text NOT NULL,
  date_of_birth text NOT NULL,
  gender text NOT NULL,
  father_name text NOT NULL,
  mother_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  photo_url text,
  class_mode text NOT NULL DEFAULT 'offline',
  preferred_batch text,
  referral_code text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transaction_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Classes
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id),
  instructor_id uuid,
  title text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  meet_link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Instructor Courses
CREATE TABLE public.instructor_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id),
  assigned_at timestamptz NOT NULL DEFAULT now()
);

-- Site Settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL,
  setting_value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==================== RLS ====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User Roles policies
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert their own role during signup" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Courses policies
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage all courses" ON public.courses FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Events policies
CREATE POLICY "Anyone can view active events" ON public.events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage all events" ON public.events FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all enrollments" ON public.enrollments FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create their own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Instructors can view enrollments for their courses" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM instructor_courses ic WHERE ic.instructor_id = auth.uid() AND ic.course_id = enrollments.course_id)
);

-- Admissions policies
CREATE POLICY "Anyone can submit admission" ON public.admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all admissions" ON public.admissions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update admissions" ON public.admissions FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete admissions" ON public.admissions FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Classes policies
CREATE POLICY "Admins can manage all classes" ON public.classes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can manage their classes" ON public.classes FOR ALL USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can view their classes" ON public.classes FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "Enrolled students can view classes" ON public.classes FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments e WHERE e.user_id = auth.uid() AND e.course_id = classes.course_id)
);

-- Instructor Courses policies
CREATE POLICY "Admins can manage instructor assignments" ON public.instructor_courses FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Instructors can view their assignments" ON public.instructor_courses FOR SELECT USING (auth.uid() = instructor_id);

-- Site Settings policies
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ==================== STORAGE ====================

INSERT INTO storage.buckets (id, name, public) VALUES ('admission-photos', 'admission-photos', true);

-- ==================== DATA INSERTION ====================

-- Courses
INSERT INTO public.courses (id, title, description, level, upi_price) VALUES
  ('a24a36ab-f429-4e15-9041-7b0a192a55c3', 'Guitar', 'Learn acoustic and electric guitar from basics to performance level. Covers chords, strumming, fingerstyle, scales, and popular songs.', 'Intermediate', 2999.00),
  ('c87b0c3c-d7ad-4a94-b4fe-084316456470', 'Piano', 'Master piano fundamentals including scales, chords, sight-reading, rhythm, and playing melodies across genres.', 'Intermediate', 3499.00),
  ('ee4948c9-129a-4549-a302-789069c81c74', 'Drums', 'Develop rhythm, timing, and coordination through structured drum practice, beats, fills, and groove training.', 'Intermediate', 2799.00),
  ('a9986581-9683-4513-87e3-01afcac2d0a6', 'Flute', 'Learn breath control, fingering techniques, classical compositions, and melodic improvisation on flute.', 'Intermediate', 2499.00),
  ('4818b6f1-bb93-4981-ace1-eebb7d7657a0', 'Ukulele', 'A fun and easy course covering basic chords, strumming patterns, and popular songs on ukulele.', 'Beginner', 1999.00),
  ('d9f0547a-682d-4460-81c5-d679d704379a', 'Tabla', 'Traditional tabla training focusing on taals, bols, hand techniques, and Hindustani rhythm patterns.', 'Intermediate', 2999.00),
  ('d1317d7e-3d23-4e73-a48f-3a2271073540', 'Vocals (Hindustani Classical)', 'Classical vocal training including alankars, ragas, sur control, breathing techniques, and voice modulation.', 'Advanced', 3999.00),
  ('84b7a5d4-689f-4f73-8c94-cb86bb726148', 'Cajon (Clap Box)', 'Learn cajon rhythms, hand techniques, groove patterns, and live performance accompaniment skills.', 'Beginner', 2299.00),
  ('27c17cf3-5e95-4699-87a7-ad6a1017786d', 'Harmonium', 'Harmonium lessons covering key handling, scales, ragas, and vocal accompaniment techniques.', 'Intermediate', 2699.00);

-- Events
INSERT INTO public.events (id, name, description, event_date, google_form_link) VALUES
  ('a4f4de18-4365-4035-9811-0f4fc7addbd8', 'Annual Music Festival 2026', 'Join us for our grand annual music festival featuring performances from students and guest artists. An evening of melodies, rhythms, and celebration!', '2026-03-15 12:30:00+00', 'https://forms.google.com'),
  ('d558dd59-a215-43e4-a4aa-3f1a1e22bbeb', 'Classical Music Workshop', 'A weekend workshop on Hindustani classical music fundamentals. Open to all skill levels.', '2026-02-28 04:30:00+00', 'https://forms.google.com');

-- Site Settings
INSERT INTO public.site_settings (id, setting_key, setting_value) VALUES
  ('7b2df072-e9fc-49d1-a016-46a3188de9ef', 'global_whatsapp_number', '+919876543210'),
  ('26915f1d-9a9f-4a55-9c65-2092b5557e5d', 'upi_id', 'musicinstitute@upi'),
  ('cc689fcd-a107-4600-a38d-c816d8d6dc19', 'hero_banner_url', ''),
  ('be7772db-f93a-45fe-a330-cddaa9d2ae8c', 'about_text', 'Welcome to our Music Institute - where passion meets excellence. We offer comprehensive music education across various instruments and vocal training, guided by experienced instructors dedicated to nurturing your musical journey.');

-- ==================== ADMIN USER SETUP ====================
-- After registering a normal account, run this to promote to admin:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL_HERE'),
--   'admin'
-- )
-- ON CONFLICT (user_id, role) DO NOTHING;
