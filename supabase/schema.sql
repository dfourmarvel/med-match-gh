create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp default now(),
  answers jsonb,
  scores jsonb,
  top_specialty text
);
