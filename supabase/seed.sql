insert into public.specialties (id, category, name, description, data)
values
  ('internal-medicine', 'medical', 'Internal Medicine', 'A cerebral specialty centered on diagnosis and complex adult care.', '{"source":"app seed"}'),
  ('general-surgery', 'medical', 'General Surgery', 'An operative field for decisive clinicians who enjoy procedures and urgency.', '{"source":"app seed"}'),
  ('general-dentistry', 'dental', 'General Dentistry', 'A broad dental career blending procedures, prevention, and continuity.', '{"source":"app seed"}')
on conflict (id) do update
set description = excluded.description,
    data = excluded.data;
