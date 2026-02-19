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

## 2. Conectar o projeto ao GitHub e enviar o código

No terminal, na pasta do projeto, rode (substitua `URL_DO_SEU_REPOSITORIO` pela URL que você copiou):

```powershell
cd "C:\Users\Jean\Desktop\Refrigeracao Pinheiral"

git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

Exemplo:
```powershell
git remote add origin https://github.com/Jean/refrigeracao-pinheiral.git
git push -u origin main
```

Se o GitHub pedir usuário/senha, use um **Personal Access Token** em vez da senha (em GitHub → Settings → Developer settings → Personal access tokens).

---

## 3. Deploy na Vercel

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
