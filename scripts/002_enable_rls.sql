-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_requirement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Zones policies
CREATE POLICY "Everyone can view zones"
  ON public.zones FOR SELECT
  USING (true);

CREATE POLICY "Coordinador general can manage zones"
  ON public.zones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'coordinador_general'
    )
  );

-- Churches policies
CREATE POLICY "Everyone can view churches"
  ON public.churches FOR SELECT
  USING (true);

CREATE POLICY "Coordinadores can manage churches"
  ON public.churches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'coordinador_zona')
    )
  );

-- Clubs policies
CREATE POLICY "Everyone can view published clubs"
  ON public.clubs FOR SELECT
  USING (true);

CREATE POLICY "Directors can manage their clubs"
  ON public.clubs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.club_members
      WHERE club_id = clubs.id 
        AND user_id = auth.uid() 
        AND role = 'director'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'coordinador_zona')
    )
  );

-- Club members policies
CREATE POLICY "Users can view club members"
  ON public.club_members FOR SELECT
  USING (true);

CREATE POLICY "Directors can manage club members"
  ON public.club_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.club_members cm
      WHERE cm.club_id = club_members.club_id 
        AND cm.user_id = auth.uid() 
        AND cm.role = 'director'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'coordinador_zona')
    )
  );

-- Specialty categories policies
CREATE POLICY "Everyone can view categories"
  ON public.specialty_categories FOR SELECT
  USING (true);

CREATE POLICY "Coordinador general can manage categories"
  ON public.specialty_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'coordinador_general'
    )
  );

-- Specialties policies
CREATE POLICY "Everyone can view published specialties"
  ON public.specialties FOR SELECT
  USING (is_published = true OR instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor')
    )
  );

CREATE POLICY "Instructors can manage their specialties"
  ON public.specialties FOR ALL
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor')
    )
  );

-- Specialty sections policies
CREATE POLICY "Users can view sections of enrolled specialties"
  ON public.specialty_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_sections.specialty_id AND s.is_published = true
    )
    OR
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_sections.specialty_id AND s.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage sections"
  ON public.specialty_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_sections.specialty_id 
        AND (s.instructor_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor')
          )
        )
    )
  );

-- Specialty requirements policies
CREATE POLICY "Users can view requirements"
  ON public.specialty_requirements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.specialty_sections ss
      JOIN public.specialties s ON s.id = ss.specialty_id
      WHERE ss.id = specialty_requirements.section_id AND s.is_published = true
    )
  );

CREATE POLICY "Instructors can manage requirements"
  ON public.specialty_requirements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.specialty_sections ss
      JOIN public.specialties s ON s.id = ss.specialty_id
      WHERE ss.id = specialty_requirements.section_id 
        AND (s.instructor_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor')
          )
        )
    )
  );

-- User specialties policies
CREATE POLICY "Users can view own enrollments"
  ON public.user_specialties FOR SELECT
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor', 'director')
    )
  );

CREATE POLICY "Users can enroll in specialties"
  ON public.user_specialties FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollments"
  ON public.user_specialties FOR UPDATE
  USING (user_id = auth.uid());

-- User requirement progress policies
CREATE POLICY "Users can view own progress"
  ON public.user_requirement_progress FOR SELECT
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor', 'director')
    )
  );

CREATE POLICY "Users can manage own progress"
  ON public.user_requirement_progress FOR ALL
  USING (user_id = auth.uid() OR reviewed_by = auth.uid());

-- Certificates policies
CREATE POLICY "Users can view own certificates"
  ON public.certificates FOR SELECT
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor', 'director')
    )
  );

CREATE POLICY "Instructors can manage certificates"
  ON public.certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'instructor')
    )
  );

-- Events policies
CREATE POLICY "Everyone can view published events"
  ON public.events FOR SELECT
  USING (is_published = true OR organizer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'coordinador_zona', 'director')
    )
  );

CREATE POLICY "Coordinadores can manage events"
  ON public.events FOR ALL
  USING (
    organizer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'coordinador_zona')
    )
  );

-- Event registrations policies
CREATE POLICY "Users can view event registrations"
  ON public.event_registrations FOR SELECT
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('coordinador_general', 'coordinador_zona', 'director')
    )
  );

CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own registrations"
  ON public.event_registrations FOR DELETE
  USING (user_id = auth.uid());

-- Blog posts policies
CREATE POLICY "Everyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'coordinador_general'
    )
  );

CREATE POLICY "Coordinador general can manage posts"
  ON public.blog_posts FOR ALL
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'coordinador_general'
    )
  );

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.club_members
      WHERE club_id = messages.club_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON public.messages FOR UPDATE
  USING (recipient_id = auth.uid());
