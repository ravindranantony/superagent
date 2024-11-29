-- Create agent_users table
CREATE TABLE agent_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create agent_tasks table
CREATE TABLE agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES agent_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  context JSONB NOT NULL,
  steps JSONB NOT NULL,
  result JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create agent_credentials table
CREATE TABLE agent_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES agent_users(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, service)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_agent_users_updated_at
  BEFORE UPDATE ON agent_users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_agent_tasks_updated_at
  BEFORE UPDATE ON agent_tasks
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_agent_credentials_updated_at
  BEFORE UPDATE ON agent_credentials
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Add RLS policies
ALTER TABLE agent_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_credentials ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own data
CREATE POLICY "Users can view own data" ON agent_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON agent_users
  FOR UPDATE USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON agent_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON agent_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON agent_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Credentials policies
CREATE POLICY "Users can view own credentials" ON agent_credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credentials" ON agent_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credentials" ON agent_credentials
  FOR UPDATE USING (auth.uid() = user_id);