-- =========================================================================
-- NOBRE CUT - DATABASE SCHEMA COMPLETO E MELHORADO
-- =========================================================================

-- Limpeza: Deleta as tabelas antigas (CASCADE apaga também os links entre elas)
-- CUIDADO: Isso apagará todos os dados de teste que você já tenha criado!
drop table if exists public.appointments cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.profiles cascade;
drop table if exists public.barber_services cascade;
drop table if exists public.barbers cascade;
drop table if exists public.services cascade;
drop table if exists public.products cascade;
drop table if exists public.blocked_times cascade;

-- 1. TABELA DE PERFIS (PROFILES)
-- Esta tabela armazena os dados públicos dos usuários (clientes e admins)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  phone text,
  bio text,
  photo_url text,
  instagram text,
  twitter text,
  facebook text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Políticas de Segurança (RLS) para Profiles
-- Permitir que qualquer pessoa veja os perfis (útil para ver o perfil do barbeiro, por ex)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);

-- Permitir que o usuário edite seu próprio perfil
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Permitir a inserção (útil caso o trigger falhe, o front-end pode tentar inserir)
drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

-- =========================================================================
-- TRIGGER PARA CRIAÇÃO AUTOMÁTICA DE PERFIL (MUITO IMPORTANTE)
-- Garante que sempre que alguém se cadastrar, o perfil é criado mesmo se o
-- usuário precisar confirmar o e-mail antes de logar.
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Remove o trigger se já existir para evitar erros
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =========================================================================
-- 2. TABELA DE ASSINATURAS (SUBSCRIPTIONS)
-- =========================================================================
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  plan_id text not null,
  treatment text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscriptions." on public.subscriptions;
create policy "Users can view own subscriptions." on public.subscriptions for select using (auth.uid() = user_id);

drop policy if exists "Admin can view all subscriptions." on public.subscriptions;
create policy "Admin can view all subscriptions." on public.subscriptions for select using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');

drop policy if exists "Users can insert own subscriptions." on public.subscriptions;
create policy "Users can insert own subscriptions." on public.subscriptions for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscriptions." on public.subscriptions;
create policy "Users can update own subscriptions." on public.subscriptions for update using (auth.uid() = user_id);


-- =========================================================================
-- 3. TABELA DE AGENDAMENTOS (APPOINTMENTS)
-- =========================================================================
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  barber_id int not null,
  barber_name text not null,
  barber_photo text not null,
  service text not null,
  date text not null,
  time text not null,
  price text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

drop policy if exists "Users can view own appointments." on public.appointments;
create policy "Users can view own appointments." on public.appointments for select using (auth.uid() = user_id);

drop policy if exists "Admin can view all appointments." on public.appointments;
create policy "Admin can view all appointments." on public.appointments for select using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');

drop policy if exists "Users can insert own appointments." on public.appointments;
create policy "Users can insert own appointments." on public.appointments for insert with check (auth.uid() = user_id);


-- =========================================================================
-- 4. BUCKET DE STORAGE (AVATARES)
-- (Descomente as linhas abaixo caso queira habilitar fotos de perfil)
-- =========================================================================
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
-- drop policy if exists "Avatar images are publicly accessible." on storage.objects;
-- create policy "Avatar images are publicly accessible." on storage.objects for select using (bucket_id = 'avatars');
-- drop policy if exists "Anyone can upload an avatar." on storage.objects;
-- create policy "Anyone can upload an avatar." on storage.objects for insert with check (bucket_id = 'avatars');
-- drop policy if exists "Anyone can update their avatar." on storage.objects;
-- =========================================================================
-- 5. CATÁLOGO DINÂMICO (BARBEIROS, SERVIÇOS E PRODUTOS)
-- =========================================================================

create table if not exists public.barbers (
  id serial primary key,
  name text not null,
  role text not null,
  rating numeric not null,
  reviews int not null,
  specialty text not null,
  experience text not null,
  exclusive boolean default false,
  photo text not null
);

create table if not exists public.barber_services (
  id serial primary key,
  barber_id int references public.barbers on delete cascade,
  name text not null,
  duration text not null,
  price text not null
);

create table if not exists public.services (
  id serial primary key,
  name text not null,
  description text not null,
  price text not null,
  icon text not null
);

create table if not exists public.products (
  id serial primary key,
  name text not null,
  brand text not null,
  description text not null,
  price text not null,
  tag text,
  photo text not null
);

alter table public.barbers enable row level security;
alter table public.barber_services enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;

-- Todos podem ver o catálogo
create policy "Public read barbers" on public.barbers for select using (true);
create policy "Public read barber_services" on public.barber_services for select using (true);
create policy "Public read services" on public.services for select using (true);
create policy "Public read products" on public.products for select using (true);

-- Apenas Admin pode modificar o catálogo
create policy "Admin mod barbers" on public.barbers using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');
create policy "Admin mod barber_services" on public.barber_services using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');
create policy "Admin mod services" on public.services using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');
create policy "Admin mod products" on public.products using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');


-- =========================================================================
-- DADOS INICIAIS (SEED DATA)
-- =========================================================================

-- Barbeiros
insert into public.barbers (id, name, role, rating, reviews, specialty, experience, exclusive, photo) values
(1, 'Rafael Moura', 'Master Barber', 4.9, 312, 'Degradê & Navalhado', '12 anos', false, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&h=600&fit=crop&auto=format'),
(2, 'Thiago Lemos', 'Senior Barber', 4.8, 247, 'Barbas & Bigodes', '8 anos', false, 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=500&h=600&fit=crop&auto=format'),
(3, 'Bruno Carvalho', 'Barber', 4.7, 189, 'Cortes Modernos', '5 anos', false, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=600&fit=crop&auto=format'),
(4, 'Diego Santana', 'Elite Barber', 5.0, 98, 'Estilo Executivo', '10 anos', true, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop&auto=format'),
(5, 'Victor Neves', 'Elite Barber', 4.9, 74, 'Técnicas Internacionais', '7 anos', true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&auto=format');

-- Serviços dos Barbeiros
insert into public.barber_services (barber_id, name, duration, price) values
(1, 'Corte Clássico', '45 min', 'R$ 30'), (1, 'Degradê Premium', '60 min', 'R$ 85'), (1, 'Navalhado', '30 min', 'R$ 50'), (1, 'Corte + Barba', '90 min', 'R$ 120'),
(2, 'Barba Completa', '40 min', 'R$ 40'), (2, 'Bigode & Acabamento', '20 min', 'R$ 35'), (2, 'Barba + Hidratação', '60 min', 'R$ 80'), (2, 'Corte + Barba', '90 min', 'R$ 110'),
(3, 'Corte Moderno', '50 min', 'R$ 70'), (3, 'Undercut', '55 min', 'R$ 75'), (3, 'Texturizado', '45 min', 'R$ 65'), (3, 'Coloração', '90 min', 'R$ 60'),
(4, 'Corte Executivo', '60 min', 'R$ 95'), (4, 'Barba Modelada', '45 min', 'R$ 75'), (4, 'Pacote Completo', '120 min', 'R$ 180'), (4, 'Hidratação', '30 min', 'R$ 55'),
(5, 'Corte Signature', '70 min', 'R$ 110'), (5, 'Degradê Artístico', '80 min', 'R$ 130'), (5, 'Barba Premium', '50 min', 'R$ 85'), (5, 'Tratamento VIP', '90 min', 'R$ 160');

-- Lista Geral de Serviços
insert into public.services (name, description, price, icon) values
('Corte Clássico', 'Corte tradicional com tesoura e máquina', 'A partir de R$ 30', '✂️'),
('Barba Completa', 'Navalha, hidratação e acabamento', 'A partir de R$ 40', '🪒'),
('Tratamentos', 'Hidratação capilar e facial', 'A partir de R$ 45', '💆'),
('Coloração', 'Tintura e reflexo masculino', 'A partir de R$ 60', '🎨'),
('Degradê Premium', 'Degradê com acabamento preciso', 'A partir de R$ 85', '💈'),
('Hidratação', 'Tratamento profundo para cabelo e barba', 'A partir de R$ 55', '🧴');

-- Produtos
insert into public.products (name, brand, description, price, tag, photo) values
('Pomada Modeladora Matte', 'Uppercut Deluxe', 'Fixação forte, acabamento fosco. Ideal para cabelos curtos e médios.', 'R$ 89,90', 'Mais Vendido', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format'),
('Cera Capilar Brilhante', 'American Crew', 'Controle e brilho com fixação média. Para estilos clássicos.', 'R$ 74,90', null, 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop&auto=format'),
('Shampoo Masculino Refrescante', 'Suavecito', 'Limpeza profunda com mentol. Remove resíduos de pomada e styling.', 'R$ 49,90', null, '/ricardo.webp'),
('Óleo para Barba', 'Barba Forte', 'Hidrata e amacia os fios. Perfume amadeirado duradouro.', 'R$ 59,90', 'Novidade', 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=400&h=400&fit=crop&auto=format'),
('Balm para Barba', 'Dapper Dan', 'Condiciona e modela a barba com fixação leve e natural.', 'R$ 64,90', null, 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=400&h=400&fit=crop&auto=format'),
('Condicionador Capilar', 'Paul Mitchell', 'Nutrição profunda. Deixa o cabelo macio e com brilho natural.', 'R$ 54,90', null, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&auto=format');

-- =========================================================================
-- 6. TABELA DE HORÁRIOS BLOQUEADOS (BLOCKED_TIMES)
-- =========================================================================
create table if not exists public.blocked_times (
  id uuid default gen_random_uuid() primary key,
  barber_id int references public.barbers on delete cascade,
  date text not null,
  time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blocked_times enable row level security;

-- Todos podem ver (para a tela de agendamento saber o que está bloqueado)
create policy "Public read blocked_times" on public.blocked_times for select using (true);

-- Apenas admin pode inserir/deletar
create policy "Admin mod blocked_times" on public.blocked_times using (auth.jwt() ->> 'email' = 'admin@nobrecut.com');
