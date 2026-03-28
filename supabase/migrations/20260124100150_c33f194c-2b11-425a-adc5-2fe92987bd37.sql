-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');

-- Create enum for course levels
CREATE TYPE public.course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create site_settings table for admin-configurable values
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  duration TEXT,
  level course_level NOT NULL DEFAULT 'Beginner',
  whatsapp_number TEXT,
  google_form_link TEXT,
  upi_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  google_form_link TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, course_id)
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_reference TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create classes table for scheduled sessions
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  meet_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create instructor_courses junction table
CREATE TABLE public.instructor_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (instructor_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_courses ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role during signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_settings (public read, admin write)
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for courses (public read for active, admin full access)
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events (public read for active, admin full access)
CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments" ON public.enrollments
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Instructors can view enrollments for their courses" ON public.enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.instructor_courses ic
      WHERE ic.instructor_id = auth.uid()
      AND ic.course_id = enrollments.course_id
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for classes
CREATE POLICY "Enrolled students can view classes" ON public.classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.user_id = auth.uid()
      AND e.course_id = classes.course_id
    )
  );

CREATE POLICY "Instructors can view their classes" ON public.classes
  FOR SELECT USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can manage their classes" ON public.classes
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all classes" ON public.classes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for instructor_courses
CREATE POLICY "Instructors can view their assignments" ON public.instructor_courses
  FOR SELECT USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage instructor assignments" ON public.instructor_courses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();