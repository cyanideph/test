-- UZZAP Chat Application Database Schema
-- This script sets up the complete database structure for the UZZAP Chat application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- TABLE DEFINITIONS
-- ===============================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  status TEXT DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_group BOOLEAN DEFAULT FALSE,
  group_admin UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat room participants
CREATE TABLE IF NOT EXISTS chat_room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT,
  type TEXT DEFAULT 'text',
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

-- Contact groups table
CREATE TABLE IF NOT EXISTS contact_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact group members
CREATE TABLE IF NOT EXISTS contact_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES contact_groups(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  UNIQUE(group_id, contact_id)
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'default',
  notifications BOOLEAN DEFAULT TRUE,
  auto_login BOOLEAN DEFAULT TRUE,
  keypad_lock BOOLEAN DEFAULT FALSE,
  keypad_lock_pin TEXT,
  offline_mode BOOLEAN DEFAULT FALSE,
  chat_background_image TEXT,
  font_size_level TEXT DEFAULT 'medium',
  sound_enabled BOOLEAN DEFAULT TRUE,
  vibration_enabled BOOLEAN DEFAULT TRUE,
  last_backup_date TIMESTAMP WITH TIME ZONE
);

-- User presence table
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  status TEXT DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health check table (for connection testing)
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT DEFAULT 'ok',
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- INDEXES
-- ===============================

-- Indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_chat_room_id ON messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Indexes for chat_room_participants table
CREATE INDEX IF NOT EXISTS idx_chat_room_participants_room_id ON chat_room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_participants_user_id ON chat_room_participants(user_id);

-- Indexes for contacts table
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_id ON contacts(contact_id);

-- Indexes for contact_group_members table
CREATE INDEX IF NOT EXISTS idx_contact_group_members_group_id ON contact_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_contact_group_members_contact_id ON contact_group_members(contact_id);

-- ===============================
-- FUNCTIONS AND TRIGGERS
-- ===============================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a user record
  INSERT INTO users (id, username, phone_number, status, last_seen)
  VALUES (NEW.id, NEW.email, '', 'offline', NOW());
  
  -- Create default settings for the user
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  
  -- Initialize user presence
  INSERT INTO user_presence (user_id, status, last_seen)
  VALUES (NEW.id, 'offline', NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to update last_seen when user status changes
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating last_seen
DROP TRIGGER IF EXISTS on_user_status_change ON users;
CREATE TRIGGER on_user_status_change
  BEFORE UPDATE OF status ON users
  FOR EACH ROW EXECUTE PROCEDURE update_last_seen();

-- Function to update last_seen in user_presence
CREATE OR REPLACE FUNCTION update_presence_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating last_seen in user_presence
DROP TRIGGER IF EXISTS on_presence_status_change ON user_presence;
CREATE TRIGGER on_presence_status_change
  BEFORE UPDATE OF status ON user_presence
  FOR EACH ROW EXECUTE PROCEDURE update_presence_last_seen();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(p_room_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE messages
  SET is_read = TRUE
  WHERE chat_room_id = p_room_id
    AND sender_id != p_user_id
    AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_count(p_room_id UUID, p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM messages
  WHERE chat_room_id = p_room_id
    AND sender_id != p_user_id
    AND is_read = FALSE;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- ROW LEVEL SECURITY POLICIES
-- ===============================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can view contacts' profiles" 
ON users FOR SELECT
USING (
  id IN (
    SELECT contact_id FROM contacts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE
USING (auth.uid() = id);

-- Chat rooms policies
CREATE POLICY "Users can view chat rooms they are part of" 
ON chat_rooms FOR SELECT
USING (
  id IN (
    SELECT room_id FROM chat_room_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create chat rooms" 
ON chat_rooms FOR INSERT
WITH CHECK (true);

CREATE POLICY "Group admins can update their groups" 
ON chat_rooms FOR UPDATE
USING (
  auth.uid() = group_admin
);

CREATE POLICY "Group admins can delete their groups" 
ON chat_rooms FOR DELETE
USING (
  auth.uid() = group_admin
);

-- Chat room participants policies
CREATE POLICY "Users can see participants in their chat rooms" 
ON chat_room_participants FOR SELECT
USING (
  room_id IN (
    SELECT room_id FROM chat_room_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can add themselves to chat rooms" 
ON chat_room_participants FOR INSERT
WITH CHECK (
  user_id = auth.uid() OR
  room_id IN (
    SELECT id FROM chat_rooms WHERE group_admin = auth.uid()
  )
);

CREATE POLICY "Users can remove themselves from chat rooms" 
ON chat_room_participants FOR DELETE
USING (
  user_id = auth.uid() OR
  room_id IN (
    SELECT id FROM chat_rooms WHERE group_admin = auth.uid()
  )
);

-- Messages policies
CREATE POLICY "Users can view messages in their chat rooms" 
ON messages FOR SELECT
USING (
  chat_room_id IN (
    SELECT room_id FROM chat_room_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their chat rooms" 
ON messages FOR INSERT
WITH CHECK (
  chat_room_id IN (
    SELECT room_id FROM chat_room_participants WHERE user_id = auth.uid()
  ) AND
  sender_id = auth.uid()
);

CREATE POLICY "Users can update their own messages" 
ON messages FOR UPDATE
USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" 
ON messages FOR DELETE
USING (sender_id = auth.uid());

-- Contacts policies
CREATE POLICY "Users can view their contacts" 
ON contacts FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can add contacts" 
ON contacts FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their contacts" 
ON contacts FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their contacts" 
ON contacts FOR DELETE
USING (user_id = auth.uid());

-- Contact groups policies
CREATE POLICY "Users can view their contact groups" 
ON contact_groups FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create contact groups" 
ON contact_groups FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their contact groups" 
ON contact_groups FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their contact groups" 
ON contact_groups FOR DELETE
USING (user_id = auth.uid());

-- Contact group members policies
CREATE POLICY "Users can view their contact group members" 
ON contact_group_members FOR SELECT
USING (
  group_id IN (
    SELECT id FROM contact_groups WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can add contacts to their groups" 
ON contact_group_members FOR INSERT
WITH CHECK (
  group_id IN (
    SELECT id FROM contact_groups WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove contacts from their groups" 
ON contact_group_members FOR DELETE
USING (
  group_id IN (
    SELECT id FROM contact_groups WHERE user_id = auth.uid()
  )
);

-- User settings policies
CREATE POLICY "Users can view their own settings" 
ON user_settings FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own settings" 
ON user_settings FOR UPDATE
USING (user_id = auth.uid());

-- User presence policies
CREATE POLICY "Anyone can view user presence" 
ON user_presence FOR SELECT
USING (true);

CREATE POLICY "Users can update their own presence" 
ON user_presence FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own presence" 
ON user_presence FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Health check policies
CREATE POLICY "Anyone can view health check" 
ON health_check FOR SELECT
USING (true);

-- ===============================
-- INITIAL DATA
-- ===============================

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('ok')
ON CONFLICT DO NOTHING;

-- ===============================
-- STORAGE SETUP
-- ===============================

-- Create storage buckets if they don't exist
-- Note: This part needs to be done manually in the Supabase dashboard
-- Create a bucket named 'media' with the following structure:
-- - /images - For chat images
-- - /audio - For voice messages
-- - /avatars - For user profile pictures

-- ===============================
-- REALTIME SETUP
-- ===============================

-- Enable realtime for all tables
BEGIN;
  -- Enable publication for all tables
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    users, 
    chat_rooms, 
    chat_room_participants, 
    messages, 
    contacts, 
    contact_groups, 
    contact_group_members, 
    user_presence;
COMMIT;

-- ===============================
-- COMPLETED SETUP
-- ===============================
