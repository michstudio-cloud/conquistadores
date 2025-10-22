-- Seed specialty categories based on the images provided
INSERT INTO public.specialty_categories (name, slug, description, icon, color) VALUES
  ('Actividades Agropecuarias', 'actividades-agropecuarias', 'Especialidades relacionadas con agricultura y ganadería', '🚜', '#FF6B35'),
  ('ADRA', 'adra', 'Actividades de ayuda humanitaria y desarrollo comunitario', '🎁', '#00BFA6'),
  ('Actividades Recreacionales', 'actividades-recreacionales', 'Deportes, juegos y actividades al aire libre', '⚡', '#A4D65E'),
  ('Actividades Vocacionales', 'actividades-vocacionales', 'Desarrollo de habilidades profesionales y oficios', '🎬', '#FF1744'),
  ('Artes & Actividades Manuales', 'artes-actividades-manuales', 'Manualidades, artesanías y expresión artística', '🎨', '#00E5FF'),
  ('Artes Domésticas', 'artes-domesticas', 'Cocina, costura y habilidades del hogar', '👨‍🍳', '#FFD600'),
  ('Actividades Misioneras', 'actividades-misioneras', 'Evangelismo y servicio misionero', '👑', '#2962FF'),
  ('Estudio de la Naturaleza', 'estudio-naturaleza', 'Exploración y conocimiento del mundo natural', '🌿', '#B4C5E4'),
  ('Salud y Ciencia', 'salud-ciencia', 'Ciencias de la salud y conocimiento científico', '❤️', '#9C27B0')
ON CONFLICT (slug) DO NOTHING;
