-- Insert sample data for development

-- Insert sample users
INSERT INTO users (id, email, name, role, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alice@company.com', 'Alice Johnson', 'Product Designer', 'online'),
  ('550e8400-e29b-41d4-a716-446655440002', 'bob@company.com', 'Bob Smith', 'Full Stack Developer', 'online'),
  ('550e8400-e29b-41d4-a716-446655440003', 'carol@company.com', 'Carol Davis', 'Technical Writer', 'away'),
  ('550e8400-e29b-41d4-a716-446655440004', 'david@company.com', 'David Wilson', 'DevOps Engineer', 'offline')
ON CONFLICT (email) DO NOTHING;

-- Insert sample channels
INSERT INTO channels (id, name, description, type, created_by) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'general', 'General team discussions', 'channel', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440002', 'development', 'Development team discussions', 'channel', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440003', 'design', 'Design team discussions', 'channel', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, assigned_to, created_by, due_date) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Design new landing page', 'Create mockups for the new product landing page', 'todo', 'high', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Implement user authentication', 'Set up login/signup flow with Supabase', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2024-01-12'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Write API documentation', 'Document all API endpoints for the mobile team', 'in-progress', 'medium', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2024-01-18'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Set up CI/CD pipeline', 'Configure automated testing and deployment', 'done', 'medium', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2024-01-10')
ON CONFLICT (id) DO NOTHING;

-- Insert sample documents
INSERT INTO documents (id, title, content, type, folder, created_by) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'Daily Standup - Jan 8, 2024', '# Daily Standup

## Attendees
- Alice Johnson
- Bob Smith  
- Carol Davis

## Yesterday''s Progress
- Completed user authentication flow
- Fixed responsive design issues

## Today''s Goals
- Start dashboard implementation
- Review design mockups', 'Meeting Notes', 'Meetings', '550e8400-e29b-41d4-a716-446655440001'),
  ('880e8400-e29b-41d4-a716-446655440002', 'Q1 Product Roadmap', '# Q1 2024 Product Roadmap

## Key Features
1. User Dashboard
2. Team Collaboration Tools
3. Mobile App MVP

## Timeline
- January: Core features
- February: Testing & refinement
- March: Launch preparation', 'Roadmap', 'Planning', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample meetings
INSERT INTO meetings (id, title, description, meeting_link, agenda, date, time, duration, status, created_by) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', 'Daily Standup', 'Daily team sync and progress update', 'https://meet.jit.si/daily-standup-team-alpha', 'Review yesterday''s progress, discuss today''s goals, identify blockers', '2024-01-08', '09:00', 30, 'upcoming', '550e8400-e29b-41d4-a716-446655440001'),
  ('990e8400-e29b-41d4-a716-446655440002', 'Product Review', 'Review Q1 product roadmap and priorities', 'https://meet.jit.si/product-review-q1-2024', 'Discuss roadmap priorities, review user feedback, plan next sprint', '2024-01-08', '14:00', 60, 'upcoming', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;
