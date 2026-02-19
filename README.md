# Refrigeração Pinheiral - Site

Site institucional e de conversão para a Refrigeração Pinheiral (assistência técnica em geladeiras, freezers, lavadoras e ar condicionado). Atendimento em Pinheiral, Volta Redonda e região.

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Configuração

- **Telefones, endereço e horário:** edite `data/config.json`.
- **Anúncios (produtos à venda):** edite `data/anuncios.json`. Use `"destaque": true` para aparecer na home.
- **Depoimentos:** edite `data/depoimentos.json`.

Imagens de produtos: coloque em `public/` e use o caminho no JSON (ex.: `/geladeira1.jpg`). Se não houver imagem, use um caminho que contenha `placeholder` no nome para exibir ícone.

## Deploy (Vercel)

**Guia completo:** veja **[docs/DEPLOY.md](docs/DEPLOY.md)** com passo a passo e lista do que você precisa.

**Resumo rápido:**
1. O que você precisa **além do endereço:** senha do painel admin (obrigatória) e, se quiser, a URL final do site. O endereço da loja pode ser preenchido depois em `data/config.json` ou pelo painel admin (Configuração).
2. O projeto já vem com **anúncios mock** para você mostrar ao cliente; no painel **Admin → Produtos** eles podem ser editados ou excluídos.
3. Suba o código no GitHub, importe o repositório na [Vercel](https://vercel.com), configure a variável `ADMIN_PASSWORD_HASH` (e opcionalmente `NEXT_PUBLIC_SITE_URL`) e faça o deploy.

## Painel Admin

O painel fica em **/admin** (ex.: http://localhost:3000/admin). Ele permite:

- **Dashboard:** totais de visitantes, orçamentos, produtos e alertas
- **Visitantes:** quantas pessoas acessaram cada página e últimos acessos
- **Formulários:** quem preencheu orçamento (leads)
- **Produtos:** criar, editar e excluir anúncios; enviar foto pela câmera ou galeria do celular
- **Configuração:** visualizar/editar dados do site
- **Depoimentos:** listar depoimentos
- **Manutenção:** ativar modo "site em manutenção" para visitantes
- **Alertas:** erros/crashes do site e tentativas de login (possível invasão)

### Proteção do painel

- **Senha:** acesso só com senha. O hash fica em variável de ambiente.
- **Sessão:** cookie HttpOnly após login (24h). Em produção use `Secure`.
- **Rate limit:** 3 tentativas de login por IP; após isso bloqueio de 15 minutos e registro em Alertas.
- **CAPTCHA (opcional):** Google reCAPTCHA v2. Se configurar chaves, o login exige CAPTCHA.

### Configurar o admin (obrigatório)

1. Gere o hash da senha:
   ```bash
   node scripts/generate-password-hash.js "SuaSenhaSegura123"
   ```

2. Crie um arquivo `.env` na raiz do projeto com:
   ```
   ADMIN_PASSWORD_HASH=o_hash_gerado_pelo_script_acima
   ```

3. (Opcional) Para CAPTCHA no login, adicione:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=sua_chave_site
   RECAPTCHA_SECRET_KEY=sua_chave_secret
   ```
   Crie as chaves em https://www.google.com/recaptcha/admin

4. Reinicie o servidor (`npm run dev`). Acesse `/admin` e entre com a senha que você usou no passo 1.

**Teste rápido:** o projeto pode vir com um `.env` de exemplo com senha `admin123`. Troque em produção.

**Uso no celular:** o painel é responsivo. No celular o menu vira um drawer (hambúrguer). Em **Produtos → Novo anúncio** você pode tocar em **Tirar foto / Escolher imagem** para abrir a câmera ou a galeria e enviar a foto do produto direto do aparelho. As fotos são salvas em `public/uploads/` (em hospedagem serverless como Vercel, pode ser necessário usar armazenamento externo).

Sem `ADMIN_PASSWORD_HASH` configurado, o login retorna erro 503.

## Roteiro de venda

Na pasta `docs/` há um arquivo **roteiro-venda.md** com dicas de como abordar a Refrigeração Pinheiral para vender o site: abertura da conversa, problema, valor, diferencial e argumentos para fechar. Use como apoio na reunião com o cliente.

## Google Meu Negócio

Para melhorar o SEO local, cadastre a empresa no [Google Meu Negócio](https://business.google.com) e mantenha nome, endereço e telefone **idênticos** aos do site.
