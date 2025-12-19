
-- Create enums for types
CREATE TYPE public.user_role AS ENUM ('vet', 'stable_owner', 'clinic_owner', 'lab_owner');
CREATE TYPE public.employment_type AS ENUM ('employee', 'freelancer');
CREATE TYPE public.organization_type AS ENUM ('stable', 'clinic', 'lab');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.horse_access_level AS ENUM ('view', 'edit', 'full');
CREATE TYPE public.record_type AS ENUM ('checkup', 'treatment', 'surgery', 'vaccination', 'diagnosis');
CREATE TYPE public.notification_type AS ENUM ('appointment', 'access_granted', 'message', 'reminder', 'system');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'vet',
  specialization TEXT,
  license_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type organization_type NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create organization memberships table
CREATE TABLE public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employment_type employment_type NOT NULL DEFAULT 'employee',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Create horses table
CREATE TABLE public.horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  color TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  microchip_id TEXT UNIQUE,
  image_url TEXT,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create horse access table
CREATE TABLE public.horse_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
  vet_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  access_level horse_access_level NOT NULL DEFAULT 'view',
  granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(horse_id, vet_id)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
  vet_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create medical records table
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
  vet_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  type record_type NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  medications JSONB,
  notes TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- RLS Policies for organizations
CREATE POLICY "Authenticated users can view organizations" ON public.organizations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owners can update their organizations" ON public.organizations FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create organizations" ON public.organizations FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for organization_memberships
CREATE POLICY "Users can view own memberships" ON public.organization_memberships FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own memberships" ON public.organization_memberships FOR ALL TO authenticated USING (user_id = auth.uid());

-- RLS Policies for horses
CREATE POLICY "Users can view horses they have access to" ON public.horses FOR SELECT TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.horse_access WHERE horse_id = horses.id AND vet_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.organization_memberships WHERE organization_id = horses.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org members can manage horses" ON public.horses FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.organization_memberships WHERE organization_id = horses.organization_id AND user_id = auth.uid()));

-- RLS Policies for horse_access
CREATE POLICY "Vets can view their horse access" ON public.horse_access FOR SELECT TO authenticated USING (vet_id = auth.uid());
CREATE POLICY "Org members can manage horse access" ON public.horse_access FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.horses h JOIN public.organization_memberships om ON h.organization_id = om.organization_id WHERE h.id = horse_access.horse_id AND om.user_id = auth.uid()));

-- RLS Policies for appointments
CREATE POLICY "Users can view their appointments" ON public.appointments FOR SELECT TO authenticated 
USING (vet_id = auth.uid() OR EXISTS (SELECT 1 FROM public.organization_memberships WHERE organization_id = appointments.organization_id AND user_id = auth.uid()));
CREATE POLICY "Vets can manage their appointments" ON public.appointments FOR ALL TO authenticated USING (vet_id = auth.uid());

-- RLS Policies for medical_records
CREATE POLICY "Users can view records for horses they access" ON public.medical_records FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM public.horse_access WHERE horse_id = medical_records.horse_id AND vet_id = auth.uid()));
CREATE POLICY "Vets can create records" ON public.medical_records FOR INSERT TO authenticated WITH CHECK (vet_id = auth.uid());
CREATE POLICY "Vets can update own records" ON public.medical_records FOR UPDATE TO authenticated USING (vet_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'vet')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_horses_updated_at BEFORE UPDATE ON public.horses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON public.medical_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
