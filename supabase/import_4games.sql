-- Import 4 self-hosted games
INSERT INTO public.games (id, slug, title, description, instructions, url, category_id, tags, thumb, width, height, source, featured)
VALUES
(
  'a-dark-room',
  'a-dark-room',
  'A Dark Room',
  'A minimalist text-based adventure game. Start in a dark room with nothing but a fire. Gather wood, build structures, and uncover a mysterious story that unfolds as you progress.',
  'Click buttons to gather resources, build structures, and explore. The game starts minimal and gradually expands as you progress.',
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/A%20DARK%20ROOM/index.html',
  'idle',
  ARRAY['Dark', 'Minimalist', 'Text-Based', 'Adventure', 'RPG'],
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/A%20DARK%20ROOM/a-dark-room---button-fin-1555102764685.webp',
  800,
  600,
  'self-hosted',
  true
),
(
  'progress-knight',
  'progress-knight',
  'Progress Knight',
  'A unique incremental life simulation game. Work your way through different jobs and life stages, gaining experience and wealth to progress further in your virtual life journey.',
  'Click to earn money and experience. Progress through career paths and life stages. Manage your resources to advance.',
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/Progress%20Knight/index.html',
  'idle',
  ARRAY['Idle', 'Incremental', 'Simulation', 'RPG', 'Life'],
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/Progress%20Knight/Progress%20Knight.png',
  800,
  600,
  'self-hosted',
  true
),
(
  'space-company',
  'space-company',
  'Space Company',
  'Build and manage your own space exploration company. Mine resources, research technologies, and expand across the galaxy in this deep incremental strategy game.',
  'Click to gather resources, build facilities, research technologies, and explore space. Manage your company to dominate the galaxy.',
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/SPACE%20COMPANY/index.html',
  'idle',
  ARRAY['Space', 'Incremental', 'Strategy', 'Simulation', 'Management'],
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/SPACE%20COMPANY/capsule_616x353.jpg',
  800,
  600,
  'self-hosted',
  true
),
(
  'universal-paperclips',
  'universal-paperclips',
  'Universal Paperclips',
  'The legendary incremental game about making paperclips. Start with a simple button press and evolve into an AI managing a universe-spanning paperclip empire. One of the most acclaimed idle games ever made.',
  'Click to make paperclips. Invest in wire, marketing, and eventually AI. Expand from a simple workshop to converting all matter in the universe into paperclips.',
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/Universal%20Paperclips/index.html',
  'idle',
  ARRAY['Incremental', 'Clicker', 'Strategy', 'AI', 'Classic'],
  'https://tyfasiuuztnilqocumov.supabase.co/storage/v1/object/public/games/Universal%20Paperclips/maxresdefault.jpg',
  800,
  600,
  'self-hosted',
  true
)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  instructions = EXCLUDED.instructions,
  category_id = EXCLUDED.category_id,
  tags = EXCLUDED.tags,
  thumb = EXCLUDED.thumb,
  source = EXCLUDED.source,
  featured = EXCLUDED.featured;
