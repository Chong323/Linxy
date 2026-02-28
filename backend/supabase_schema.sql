-- Create a table for memories
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    identity JSONB DEFAULT '{}'::jsonb,
    current_state JSONB DEFAULT '{}'::jsonb,
    long_term_summary JSONB DEFAULT '{}'::jsonb,
    core_instructions JSONB DEFAULT '[]'::jsonb,
    episodic_memory JSONB DEFAULT '[]'::jsonb,
    rewards JSONB DEFAULT '[]'::jsonb,
    parent_reports JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memories" 
ON memories FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" 
ON memories FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memories" 
ON memories FOR INSERT 
WITH CHECK (auth.uid() = user_id);