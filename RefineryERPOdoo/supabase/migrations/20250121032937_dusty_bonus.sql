/*
  # Quality Management Module Schema

  1. New Tables
    - documents
      - all system documents with versioning
    - document_types
      - categories of documents
    - processes
      - business processes
    - process_indicators
      - KPIs for processes
    - audits
      - internal/external audits
    - non_conformities
      - quality issues and resolutions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Document types
CREATE TABLE IF NOT EXISTS document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(4) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  title varchar(200) NOT NULL,
  content text,
  version varchar(10) NOT NULL DEFAULT '1.0',
  status varchar(20) NOT NULL DEFAULT 'draft',
  type_id uuid REFERENCES document_types(id),
  area_id uuid REFERENCES areas(id),
  process_id uuid,
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  archived_at timestamptz
);

-- Document versions
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id),
  version varchar(10) NOT NULL,
  content text,
  changes_description text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Processes
CREATE TABLE IF NOT EXISTS processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(4) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  description text,
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Process indicators (KPIs)
CREATE TABLE IF NOT EXISTS process_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id uuid REFERENCES processes(id),
  name varchar(100) NOT NULL,
  description text,
  target_value numeric,
  unit varchar(20),
  frequency varchar(20),
  calculation_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indicator measurements
CREATE TABLE IF NOT EXISTS indicator_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id uuid REFERENCES process_indicators(id),
  value numeric NOT NULL,
  measurement_date timestamptz NOT NULL,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Audits
CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  type varchar(20) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'planned',
  planned_date timestamptz NOT NULL,
  completion_date timestamptz,
  auditor_id uuid REFERENCES auth.users(id),
  area_id uuid REFERENCES areas(id),
  findings text,
  recommendations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Non-conformities
CREATE TABLE IF NOT EXISTS non_conformities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  description text NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'open',
  severity varchar(20) NOT NULL,
  process_id uuid REFERENCES processes(id),
  detected_by uuid REFERENCES auth.users(id),
  assigned_to uuid REFERENCES auth.users(id),
  detection_date timestamptz NOT NULL,
  resolution_date timestamptz,
  root_cause text,
  corrective_action text,
  preventive_action text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_conformities ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can read all document types"
  ON document_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read published documents"
  ON documents FOR SELECT
  TO authenticated
  USING (status = 'published' OR created_by = auth.uid());

CREATE POLICY "Users can read process information"
  ON processes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read KPIs"
  ON process_indicators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read audit information"
  ON audits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read non-conformities"
  ON non_conformities FOR SELECT
  TO authenticated
  USING (true);