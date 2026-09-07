-- ==============================================================================
-- GTR MOTORS - SUPABASE DATABASE SCHEMA INITIALIZATION
-- Execute este script no SQL Editor do seu painel Supabase
-- ==============================================================================

-- 1. Extensão para geração de UUIDs e Criptografia
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABELA: admins (Autenticação do Painel Administrativo)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Administrador GTR',
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABELA: vehicles (Estoque de Carros e Motos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'carro',
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '',
    year_model TEXT NOT NULL,
    mileage NUMERIC NOT NULL DEFAULT 0,
    price NUMERIC NOT NULL DEFAULT 0,
    promotional_price NUMERIC,
    fuel TEXT NOT NULL DEFAULT 'Flex',
    transmission TEXT NOT NULL DEFAULT 'Automático',
    color TEXT NOT NULL DEFAULT 'Preto',
    body_type TEXT NOT NULL DEFAULT 'SUV',
    license_plate_end TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'Disponível',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABELA: appraisals (Avaliação e Propostas "Venda Seu Veículo")
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.appraisals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT NOT NULL,
    mileage TEXT,
    desired_price TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Novo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABELA: simulations (Simulações de Financiamento)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cpf TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_interest TEXT,
    entry_value NUMERIC,
    installments INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. ÍNDICES PARA ALTA PERFORMANCE E BUSCAS RÁPIDAS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON public.vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) E POLÍTICAS DE ACESSO
-- ==============================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Políticas de Veículos: Leitura pública, escrita permitida para a aplicação/service role
DROP POLICY IF EXISTS "Permitir visualizacao publica de veiculos" ON public.vehicles;
CREATE POLICY "Permitir visualizacao publica de veiculos" ON public.vehicles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestao total de veiculos" ON public.vehicles;
CREATE POLICY "Permitir gestao total de veiculos" ON public.vehicles
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas de Administradores
DROP POLICY IF EXISTS "Permitir autenticacao de admins" ON public.admins;
CREATE POLICY "Permitir autenticacao de admins" ON public.admins
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas de Avaliações / Propostas
DROP POLICY IF EXISTS "Permitir envio publico de propostas" ON public.appraisals;
CREATE POLICY "Permitir envio publico de propostas" ON public.appraisals
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de avaliacoes" ON public.appraisals;
CREATE POLICY "Permitir leitura de avaliacoes" ON public.appraisals
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas de Financiamentos
DROP POLICY IF EXISTS "Permitir envio publico de simulacoes" ON public.simulations;
CREATE POLICY "Permitir envio publico de simulacoes" ON public.simulations
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de simulacoes" ON public.simulations;
CREATE POLICY "Permitir leitura de simulacoes" ON public.simulations
    FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. DADOS INICIAIS (SEEDS)
-- ==============================================================================

-- 8.1. Administrador Padrão (Login: admin@gtrmotors.com.br / Senha: GTR8217#)
INSERT INTO public.admins (email, password_hash, name, role)
VALUES (
    'admin@gtrmotors.com.br',
    'GTR8217#',
    'Administrador GTR',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- 8.2. Estoque Inicial de Veículos
INSERT INTO public.vehicles (id, category, brand, model, version, year_model, mileage, price, fuel, transmission, color, body_type, license_plate_end, description, features, photos, featured, status)
VALUES 
(
    'car-01',
    'carro',
    'Honda',
    'Civic',
    'Touring 1.5 Turbo 16V',
    '2024/2024',
    32000,
    159990,
    'Gasolina',
    'CVT',
    'Cinza Cósmico Metálico',
    'Sedan',
    '4',
    'Veículo em excelente estado de conservação, revisado, com laudo cautelar aprovado 100%. Motor 1.5 Turbo potente e econômico, interior refinado em couro claro e teto solar.',
    '["Teto Solar Elétrico", "Painel Digital TFT", "Central Multimídia Apple CarPlay & Android Auto", "Câmera de Ponto Cego LaneWatch", "Bancos em Couro com Ajuste Elétrico", "Faróis Full LED", "Controle de Cruzeiro Adaptativo (ACC)", "Sensor de Estacionamento Diant/Tras", "Chave Presencial com Partida Remota"]'::jsonb,
    '["https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    true,
    'Disponível'
),
(
    'car-02',
    'carro',
    'Toyota',
    'Corolla Cross',
    'XRX 1.8 Hybrid Flex',
    '2023/2024',
    28500,
    168900,
    'Híbrido',
    'Automático',
    'Branco Pérola',
    'SUV',
    '7',
    'SUV híbrido de altíssima eficiência e conforto absoluto. Histórico completo de revisões em concessionária, único dono e garantia estendida de fábrica para o sistema híbrido.',
    '["Motorização Híbrida Flex", "Pacote Toyota Safety Sense", "Alerta de Mudança de Faixa", "Frenagem Autônoma de Emergência", "Teto Solar Elétrico", "Bancos em Couro Terracota", "Cluster Digital 7 Polegadas", "Carregador por Indução"]'::jsonb,
    '["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    true,
    'Disponível'
),
(
    'car-03',
    'carro',
    'Volkswagen',
    'T-Cross',
    'Highline 250 TSI Automático',
    '2023/2023',
    39000,
    124900,
    'Flex',
    'Automático',
    'Preto Ninja',
    'SUV',
    '2',
    'Versão topo de linha do SUV mais desejado do Brasil. Motor 1.4 Turbo com 150cv, cockpit digital Active Info Display e painel moderno.',
    '["Active Info Display 10.25\"", "VW Play com tela de 10\"", "Sensor de Fadiga do Motorista", "Rodas de Liga Leve Aro 17 diamantadas", "Câmera de Ré HD com linhas guia", "Ar-condicionado Climatronic", "Paddle Shifts para Troca de Marchas"]'::jsonb,
    '["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    true,
    'Disponível'
),
(
    'bike-01',
    'moto',
    'BMW',
    'R 1250 GS',
    'Adventure Triple Black Premium',
    '2023/2023',
    14000,
    112900,
    'Gasolina',
    'Manual',
    'Triple Black',
    'Big Trail',
    '9',
    'A rainha das Big Trails. Edição Triple Black impecável, equipada com todos os modos Pro de pilotagem, suspensão Dynamic ESA e iluminação adaptativa.',
    '["Painel TFT 6.5 polegadas com Conectividade", "Shift Assistant Pro (Quickshifter)", "Suspensão Eletrônica Dynamic ESA", "Modos de Pilotagem Pro (Dynamic, Enduro Pro)", "Aquecimento de Manoplas e Assentos", "Farol Dianteiro Adaptativo em Curva", "Freios BMW Motorrad ABS Pro", "Controle de Pressão dos Pneus (RDC)"]'::jsonb,
    '["https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    true,
    'Disponível'
)
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    mileage = EXCLUDED.mileage,
    updated_at = NOW();
