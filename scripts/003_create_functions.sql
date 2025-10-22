-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    username,
    display_name,
    phone,
    birth_date,
    gender,
    country,
    postal_code,
    city,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE((NEW.raw_user_meta_data->>'birth_date')::DATE, NULL),
    COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
    COALESCE(NEW.raw_user_meta_data->>'country', NULL),
    COALESCE(NEW.raw_user_meta_data->>'postal_code', NULL),
    COALESCE(NEW.raw_user_meta_data->>'city', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'conquistador')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_zones
  BEFORE UPDATE ON public.zones
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_clubs
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_specialties
  BEFORE UPDATE ON public.specialties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_specialty_sections
  BEFORE UPDATE ON public.specialty_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_events
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_blog_posts
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate specialty progress
CREATE OR REPLACE FUNCTION public.calculate_specialty_progress(
  p_user_id UUID,
  p_specialty_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  total_requirements INTEGER;
  completed_requirements INTEGER;
  progress INTEGER;
BEGIN
  -- Count total requirements for the specialty
  SELECT COUNT(*)
  INTO total_requirements
  FROM public.specialty_requirements sr
  JOIN public.specialty_sections ss ON ss.id = sr.section_id
  WHERE ss.specialty_id = p_specialty_id AND sr.is_required = true;

  -- Count completed requirements
  SELECT COUNT(*)
  INTO completed_requirements
  FROM public.user_requirement_progress urp
  JOIN public.specialty_requirements sr ON sr.id = urp.requirement_id
  JOIN public.specialty_sections ss ON ss.id = sr.section_id
  WHERE ss.specialty_id = p_specialty_id 
    AND urp.user_id = p_user_id 
    AND urp.is_completed = true
    AND sr.is_required = true;

  -- Calculate percentage
  IF total_requirements > 0 THEN
    progress := (completed_requirements * 100) / total_requirements;
  ELSE
    progress := 0;
  END IF;

  -- Update user_specialties table
  UPDATE public.user_specialties
  SET progress_percentage = progress,
      status = CASE 
        WHEN progress = 100 THEN 'completed'::specialty_status
        ELSE status
      END,
      completed_at = CASE 
        WHEN progress = 100 AND completed_at IS NULL THEN NOW()
        ELSE completed_at
      END
  WHERE user_id = p_user_id AND specialty_id = p_specialty_id;

  RETURN progress;
END;
$$;
