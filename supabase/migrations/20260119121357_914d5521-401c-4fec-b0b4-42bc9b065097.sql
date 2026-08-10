-- Create company_profiles table (one per user)
CREATE TABLE public.company_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create roles table
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role_name TEXT NOT NULL DEFAULT 'New Role',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  problem_statement TEXT NOT NULL,
  competency TEXT NOT NULL,
  outcome TEXT NOT NULL,
  program_name TEXT NOT NULL,
  program_description TEXT NOT NULL,
  program_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_habits JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Company profiles policies
CREATE POLICY "Users can view own company profile"
  ON public.company_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company profile"
  ON public.company_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company profile"
  ON public.company_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Roles policies
CREATE POLICY "Users can view own roles"
  ON public.roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own roles"
  ON public.roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roles"
  ON public.roles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roles"
  ON public.roles FOR DELETE
  USING (auth.uid() = user_id);

-- Programs policies
CREATE POLICY "Users can view own programs"
  ON public.programs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own programs"
  ON public.programs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER set_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();