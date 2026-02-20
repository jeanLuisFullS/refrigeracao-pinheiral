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

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto (ex: `https://xxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` - **obrigatório usar a chave service_role** (em Settings > API, é a "service_role" secret), **não** a anon key
- `SESSION_SECRET` - string aleatória para cookie de sessão
- `ADMIN_PASSWORD_HASH` (opcional) - hash bcrypt da senha

**Importante:** Depois de alterar variáveis na Vercel, faça um novo deploy (Deployments > ... > Redeploy) para as mudanças valerem.

Sem Supabase configurado, o site continua usando os JSON em `data/` e upload em disco ou link externo.

## 5. Popular as tabelas com os dados iniciais (seed)

Para preencher config, anúncios e depoimentos com o conteúdo de `data/config.json`, `data/anuncios.json` e `data/depoimentos.json` (incluindo as imagens já definidas nos anúncios), rode **uma vez** na pasta do projeto:

```bash
npm run seed:supabase
```

Ou, com Node direto:

```bash
node scripts/seed-supabase.js
```

O script usa as variáveis do arquivo `.env` (ou do ambiente). Garanta que `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estejam definidas no `.env` local. Depois do seed, o site (e o admin) passam a exibir esses dados quando usarem o Supabase.

## 6. Se edições não salvarem na Vercel

1. Confira os **nomes exatos** das variáveis: `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
2. Use a chave **service_role** (secret), não a **anon** (pública). No Supabase: Settings > API > Project API keys > "service_role".
3. Depois de mudar as variáveis, faça **Redeploy** do projeto na Vercel.
4. Ao salvar ou excluir no admin, se der erro, a mensagem na tela deve mostrar o motivo (ex.: erro do Supabase ou aviso para conferir as variáveis).
