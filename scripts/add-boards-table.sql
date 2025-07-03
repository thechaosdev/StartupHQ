-- Add boards table for workspace management
CREATE TABLE IF NOT EXISTS boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template VARCHAR(100) NOT NULL,
  team_size VARCHAR(20),
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Board members junction table
CREATE TABLE IF NOT EXISTS board_members (
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (board_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_boards_created_by ON boards(created_by);
CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Users can view boards they are members of" ON boards
  FOR SELECT USING (
    id IN (
      SELECT board_id FROM board_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create boards" ON boards
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Board admins can update boards" ON boards
  FOR UPDATE USING (
    id IN (
      SELECT board_id FROM board_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Board admins can delete boards" ON boards
  FOR DELETE USING (
    id IN (
      SELECT board_id FROM board_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for board_members
CREATE POLICY "Users can view board members of their boards" ON board_members
  FOR SELECT USING (
    board_id IN (
      SELECT board_id FROM board_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Board admins can manage members" ON board_members
  FOR ALL USING (
    board_id IN (
      SELECT board_id FROM board_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
