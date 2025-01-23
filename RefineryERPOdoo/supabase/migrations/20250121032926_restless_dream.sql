/*
  # Nomenclador-CVP Database Schema

  1. New Tables
    - users (extends Supabase auth.users)
      - role, area, position details
    - areas
      - company organizational structure
    - positions
      - job positions and responsibilities
    - roles
      - system access roles and permissions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Areas table
CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(2) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  description text,
  parent_id uuid REFERENCES areas(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(4) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  description text,
  area_id uuid REFERENCES areas(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(4) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Extended user profile
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role_id uuid REFERENCES roles(id),
  position_id uuid REFERENCES positions(id),
  area_id uuid REFERENCES areas(id),
  full_name varchar(100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read all areas"
  ON areas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all positions"
  ON positions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);