# Supabase - Configuração

Com Supabase configurado, o site na Vercel usa o banco para anúncios, depoimentos, config e senha do admin, e o Storage para fotos.

## 1. Criar projeto

1. Acesse supabase.com e crie um projeto.
2. Em Settings > API anote: Project URL (`NEXT_PUBLIC_SUPABASE_URL`) e service_role key (`SUPABASE_SERVICE_ROLE_KEY`).

## 2. Tabelas (SQL Editor no Supabase)

```sql
create table if not exists public.config (
  id int primary key default 1,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.anuncios (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.depoimentos (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.admin_settings (
  id int primary key default 1,
  password_hash text,
  updated_at timestamptz default now()
);

alter table public.config enable row level security;
alter table public.anuncios enable row level security;
alter table public.depoimentos enable row level security;
alter table public.admin_settings enable row level security;

create policy "Service role full access config" on public.config for all using (true) with check (true);
create policy "Service role full access anuncios" on public.anuncios for all using (true) with check (true);
create policy "Service role full access depoimentos" on public.depoimentos for all using (true) with check (true);
create policy "Service role full access admin_settings" on public.admin_settings for all using (true) with check (true);
```

## 3. Storage

Em Storage crie um bucket público chamado `uploads`.

## 4. Variáveis na Vercel

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto
- `SUPABASE_SERVICE_ROLE_KEY` - chave service_role
- `SESSION_SECRET` - string aleatória para cookie de sessão
- `ADMIN_PASSWORD_HASH` (opcional) - hash bcrypt da senha

Sem Supabase configurado, o site continua usando os JSON em `data/` e upload em disco ou link externo.
