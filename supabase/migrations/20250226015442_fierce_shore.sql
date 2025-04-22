/*
  # Criação das tabelas iniciais do sistema

  1. Novas Tabelas
    - `users`: Armazena informações dos usuários do sistema
    - `patients`: Cadastro de pacientes
    - `schedules`: Escalas de trabalho
    - `equipment`: Equipamentos médicos e hospitalares

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas em função do usuário
*/

-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'staff')),
  name text NOT NULL,
  specialization text,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criação da tabela de pacientes
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  contact_number text NOT NULL,
  address text NOT NULL,
  medical_history jsonb DEFAULT '[]'::jsonb,
  current_status text NOT NULL CHECK (current_status IN ('admitted', 'discharged', 'emergency')),
  admission_date timestamptz,
  discharge_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criação da tabela de escalas
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon', 'night')),
  department text NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criação da tabela de equipamentos
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('medical', 'general')),
  status text NOT NULL CHECK (status IN ('available', 'in-use', 'maintenance')),
  location text NOT NULL,
  last_maintenance timestamptz NOT NULL,
  next_maintenance timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para usuários
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Only admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (role = 'admin');

CREATE POLICY "Only admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (role = 'admin');

-- Políticas de segurança para pacientes
CREATE POLICY "Authenticated users can view patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Medical staff can insert patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'doctor', 'nurse')
  ));

CREATE POLICY "Medical staff can update patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'doctor', 'nurse')
  ));

-- Políticas de segurança para escalas
CREATE POLICY "Users can view their schedules"
  ON schedules
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

CREATE POLICY "Admins can manage schedules"
  ON schedules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Políticas de segurança para equipamentos
CREATE POLICY "Authenticated users can view equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage equipment"
  ON equipment
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'staff')
  ));