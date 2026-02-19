# Deploy do site Refrigeração Pinheiral

Este guia explica o que você precisa ter em mãos e como subir o site para produção (Vercel).

---

## O que você precisa (além do endereço da loja)

Antes de fazer o deploy, reúna estes dados. Quase tudo pode ser editado depois no painel admin ou em `data/config.json` no repositório.

| O que | Onde usar | Obrigatório? |
|-------|-----------|--------------|
| **Endereço da loja** (rua, número, bairro, cidade, estado, CEP) | `data/config.json` → `endereco` (rua, cidade, estado, cep). Aparece no rodapé, na página Contato e no SEO (Google). | Não para subir; sim para SEO local e mapa. |
| **Telefones / WhatsApp** | Já estão em `data/config.json`. Confira se estão corretos. | Já preenchido; conferir. |
| **Horário de funcionamento** | `data/config.json` → `horario`. | Já preenchido; conferir. |
| **Senha do painel admin** | Variável de ambiente `ADMIN_PASSWORD_HASH` na Vercel. O projeto já vem com uma **senha inicial** (veja seção abaixo); após o primeiro login, troque em **Admin → Trocar senha**. | **Sim** – sem ela o painel não abre. |
| **URL final do site** | Variável `NEXT_PUBLIC_SITE_URL` na Vercel (ex.: `https://refrigeracaopinheiral.com.br`). Usada no sitemap e SEO. | Recomendado. |

**Resumo:** para só “subir” o site você precisa basicamente da **senha do admin** (e opcionalmente da URL). O endereço completo da loja pode ser colocado depois em `data/config.json` e um novo deploy, ou pelo painel admin se a tela de Configuração permitir editar endereço.

---

## Senha inicial do painel admin

O projeto está configurado com uma senha inicial para o painel (**/admin**):

- **Senha inicial:** `123456admin`

**Trocar a senha:** quando quiserem, podem ir em **Admin → Trocar senha**, informar a senha atual e a nova. A nova senha passa a valer na hora (salva em `data/admin.json`). Em produção na **Vercel**, o sistema de arquivos é somente leitura, então a alteração pode não persistir; nesse caso, gere um novo hash com `node scripts/generate-password-hash.js "SuaNovaSenha"` e atualize a variável `ADMIN_PASSWORD_HASH` no painel da Vercel e faça um novo deploy.

---

## Onde colocar o endereço da loja

Quando a loja te passar o endereço, edite o arquivo **`data/config.json`**:

```json
"endereco": {
  "rua": "Rua Exemplo, 123 - Bairro Centro",
  "cidade": "Pinheiral",
  "estado": "RJ",
  "cep": "27197-000"
}
```

- **rua:** rua, número e bairro em uma linha.  
- **cidade, estado, cep:** como acima.  

Depois faça commit e um novo deploy. Você também pode editar o endereço pelo **Admin → Configuração** (o JSON completo é editável lá; clique em Salvar).

---

## Anúncios mock (demonstração)

O projeto já vem com **anúncios de exemplo** em `data/anuncios.json` (geladeiras, freezer, lavadora, ar condicionado) para você mostrar como fica o site para o cliente.

- Eles aparecem na **home** (os marcados com `"destaque": true`) e na página **Produtos**.
- No **painel admin** (**/admin** → Produtos) você pode:
  - **Editar** qualquer anúncio (título, descrição, preço, foto, destaque).
  - **Excluir** qualquer anúncio.
  - **Criar** novos anúncios.

Ou seja: os mocks são editáveis e deletáveis pelo admin; quando a loja for usar de verdade, podem apagar os de exemplo e cadastrar os produtos reais.

---

## Como fazer o deploy (Vercel)

### 1. Conta e repositório

1. Crie uma conta em [vercel.com](https://vercel.com) (pode usar login com GitHub).
2. Envie o projeto para um repositório Git (GitHub, GitLab ou Bitbucket):
   - Na pasta do projeto:
     ```bash
     git init
     git add .
     git commit -m "Site Refrigeração Pinheiral"
     ```
   - Crie um repositório no GitHub e envie:
     ```bash
     git remote add origin https://github.com/SEU_USUARIO/refrigeracao-pinheiral.git
     git branch -M main
     git push -u origin main
     ```

### 2. Importar o projeto na Vercel

1. No dashboard da Vercel, clique em **Add New…** → **Project**.
2. **Import** o repositório do site (ex.: `refrigeracao-pinheiral`).
3. Framework: a Vercel detecta **Next.js**; não precisa mudar.
4. Em **Environment Variables** (variáveis de ambiente), adicione:

   | Nome | Valor | Obrigatório |
   |------|--------|-------------|
   | `ADMIN_PASSWORD_HASH` | Hash gerado por `node scripts/generate-password-hash.js "SuaSenhaForte"` | **Sim** |
   | `NEXT_PUBLIC_SITE_URL` | URL final do site (ex.: `https://refrigeracaopinheiral.com.br`) | Recomendado |

5. Clique em **Deploy**.

### 3. Gerar o hash da senha do admin

No seu computador, na pasta do projeto:

```bash
node scripts/generate-password-hash.js "SenhaQueALojaVaiUsar"
```

Copie o valor que aparecer e cole em `ADMIN_PASSWORD_HASH` na Vercel. A senha de acesso ao `/admin` será a que você colocou entre aspas.

### 4. Depois do deploy

- A Vercel vai dar uma URL tipo `seu-projeto.vercel.app`. Você pode usar essa URL para mostrar o site.
- Para usar um **domínio próprio** (ex.: `refrigeracaopinheiral.com.br`): na Vercel, abra o projeto → **Settings** → **Domains** e adicione o domínio. Depois ajuste `NEXT_PUBLIC_SITE_URL` para essa URL e faça um novo deploy.
- Acesse **https://sua-url/admin**, entre com a senha que você definiu no hash e confira se os anúncios mock aparecem; edite ou exclua para testar.

---

## Resumo rápido

1. **Ter em mãos:** senha para o admin (e, se quiser, endereço e URL final).
2. **Endereço:** quando tiver, preencher em `data/config.json` → `endereco`.
3. **Anúncios:** mocks já vêm no projeto; no admin você edita, apaga ou adiciona novos.
4. **Deploy:** subir o código no GitHub → importar na Vercel → configurar `ADMIN_PASSWORD_HASH` (e opcionalmente `NEXT_PUBLIC_SITE_URL`) → Deploy.

Se algo falhar no build na Vercel, confira o log de deploy; na maioria das vezes é variável de ambiente faltando (principalmente `ADMIN_PASSWORD_HASH`).
