# Comandos para subir no GitHub e Vercel

O Git já foi inicializado e o primeiro commit foi feito. Siga os passos abaixo.

---

## 1. Criar o repositório no GitHub

1. Acesse **https://github.com/new**
2. **Repository name:** por exemplo `refrigeracao-pinheiral` ou `site-refrigeracao-pinheiral`
3. Deixe **Public**
4. **Não** marque "Add a README" (o projeto já tem um)
5. Clique em **Create repository**
6. Copie a URL do repositório (ex: `https://github.com/SEU_USUARIO/refrigeracao-pinheiral.git`)

---

## 2. Criar um Personal Access Token (obrigatório)

**O GitHub não aceita mais a senha da sua conta** no terminal. Você precisa de um **token**.

1. No GitHub, clique na sua **foto** (canto superior direito) → **Settings**.
2. No menu da esquerda, vá em **Developer settings** (bem no final).
3. Clique em **Personal access tokens** → **Tokens (classic)**.
4. Clique em **Generate new token** → **Generate new token (classic)**.
5. Dê um nome (ex: `Cursor Refrigeracao Pinheiral`).
6. Marque o prazo (ex: **90 days** ou **No expiration**).
7. Marque a permissão **repo** (acesso a repositórios).
8. Clique em **Generate token**.
9. **Copie o token** (começa com `ghp_...`) e guarde em um lugar seguro. Ele não aparece de novo.

---

## 3. Conectar o projeto e enviar o código

O `remote` você já adicionou. Agora é só dar o push **usando o token no lugar da senha**.

Quando rodar `git push`, o Git vai pedir:
- **Username:** `JeanLuisFullS` (seu usuário)
- **Password:** **cole o token** (o que começa com `ghp_...`), **não** a senha da conta

Comandos no PowerShell (na pasta do projeto):

```powershell
cd "C:\Users\Jean\Desktop\Refrigeracao Pinheiral"
git push -u origin main
```

Quando pedir a senha, **cole o token**.

### Alternativa: colocar o token na URL (evita digitar toda vez)

Se quiser, pode usar o token direto na URL do remote (assim o Git não pergunta senha):

```powershell
git remote set-url origin https://JeanLuisFullS:SEU_TOKEN_AQUI@github.com/jeanLuisFullS/refrigeracao-pinheiral.git
git push -u origin main
```

Substitua `SEU_TOKEN_AQUI` pelo token que você copiou (ex: `ghp_xxxxxxxxxxxx`). Depois do push, por segurança você pode tirar o token da URL:

```powershell
git remote set-url origin https://github.com/jeanLuisFullS/refrigeracao-pinheiral.git
```

---

## 4. Deploy na Vercel

### Opção A – Pelo site (recomendado)

1. Acesse **https://vercel.com** e faça login (pode usar conta GitHub).
2. Clique em **Add New** → **Project**.
3. **Import** o repositório que você criou no GitHub (ex: `refrigeracao-pinheiral`).
4. Em **Environment Variables** adicione:
   - `ADMIN_PASSWORD_HASH` = (cole o hash da senha do admin – veja o `.env` local ou rode `node scripts/generate-password-hash.js "123456admin"`)
   - `NEXT_PUBLIC_SITE_URL` = `https://seu-dominio.vercel.app` (pode ajustar depois do primeiro deploy)
5. Clique em **Deploy**. O site ficará no ar em poucos minutos.

### Opção B – Pelo terminal

```powershell
cd "C:\Users\Jean\Desktop\Refrigeracao Pinheiral"
npx vercel login
npx vercel --prod
```

No primeiro `vercel`, faça login no navegador. No deploy, informe as variáveis quando perguntado ou configure depois no dashboard da Vercel (Settings → Environment Variables).

---

## Resumo do que já foi feito

- `git init`
- `git add .`
- `git commit -m "Initial commit: site Refrigeracao Pinheiral"`
- Branch renomeada para `main`

Depois de criar o repositório no GitHub e rodar `git remote add origin ...` e `git push -u origin main`, o código estará no GitHub. A partir daí, use a Opção A (site da Vercel) para conectar o repositório e fazer o deploy.
