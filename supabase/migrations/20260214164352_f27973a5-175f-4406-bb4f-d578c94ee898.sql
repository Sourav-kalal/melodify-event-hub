
-- Create admissions table
CREATE TABLE public.admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- Enable RLS
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit an application)
CREATE POLICY "Anyone can submit admission"
ON public.admissions FOR INSERT
WITH CHECK (true);

-- Admins can read all admissions
CREATE POLICY "Admins can view all admissions"
ON public.admissions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update admissions (change status)
CREATE POLICY "Admins can update admissions"
ON public.admissions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete admissions
CREATE POLICY "Admins can delete admissions"
ON public.admissions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for admission photos
INSERT INTO storage.buckets (id, name, public) VALUES ('admission-photos', 'admission-photos', true);

-- Anyone can upload to admission-photos
CREATE POLICY "Anyone can upload admission photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'admission-photos');

-- Public read access for admission photos
CREATE POLICY "Public read admission photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'admission-photos');
