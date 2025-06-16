-- Create a table for vaults
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.vaults (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    access_key TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE,
    accessed BOOLEAN DEFAULT false
);

-- Create a table for secrets within vaults
CREATE TABLE public.secrets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    vault_id uuid NOT NULL REFERENCES public.vaults(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    UNIQUE(vault_id, key)
);

-- Create a table for user profiles
CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    bio TEXT,
    premium BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Vault Policies: Users can manage their own vaults
CREATE POLICY "Users can view their own vaults" ON public.vaults
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vaults" ON public.vaults
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vaults" ON public.vaults
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vaults" ON public.vaults
    FOR DELETE
    USING (auth.uid() = user_id);

-- Secret Policies: Users can manage secrets in their own vaults
CREATE POLICY "Users can view secrets in their own vaults" ON public.secrets
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.vaults 
        WHERE vaults.id = secrets.vault_id 
        AND vaults.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert secrets in their own vaults" ON public.secrets
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.vaults 
        WHERE vaults.id = secrets.vault_id 
        AND vaults.user_id = auth.uid()
    ));

CREATE POLICY "Users can update secrets in their own vaults" ON public.secrets
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.vaults 
        WHERE vaults.id = secrets.vault_id 
        AND vaults.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete secrets in their own vaults" ON public.secrets
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.vaults 
        WHERE vaults.id = secrets.vault_id 
        AND vaults.user_id = auth.uid()
    ));

-- Profile Policies: Users can manage their own profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indices for better performance
CREATE INDEX vaults_user_id_idx ON public.vaults (user_id);
CREATE INDEX vaults_created_at_idx ON public.vaults (created_at);
CREATE INDEX vaults_access_key_idx ON public.vaults (access_key);
CREATE INDEX secrets_vault_id_idx ON public.secrets (vault_id);
CREATE INDEX secrets_key_idx ON public.secrets (key);
CREATE INDEX secrets_created_at_idx ON public.secrets (created_at);
CREATE INDEX profiles_user_id_idx ON public.profiles (user_id);
CREATE INDEX profiles_username_idx ON public.profiles (username);
CREATE INDEX profiles_created_at_idx ON public.profiles (created_at);

-- Grant access to authenticated users
GRANT ALL ON public.vaults TO authenticated;
GRANT ALL ON public.secrets TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_vaults_updated_at BEFORE UPDATE ON public.vaults
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secrets_updated_at BEFORE UPDATE ON public.secrets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
