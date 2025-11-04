# 🚀 Guia de Deploy no GitHub Pages

Este documento explica como publicar o projeto no GitHub Pages.

## 📋 Pré-requisitos

- Repositório no GitHub
- Git configurado localmente
- Implementação básica funcionando

## 🔧 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Inicializar repositório (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Estrutura do projeto autocomplete"

# Adicionar remote (substitua com seu repositório)
git remote add origin https://github.com/seu-usuario/trie-form-autocomplete.git

# Push para o GitHub
git push -u origin main
```

### 2. Configurar GitHub Pages

1. Vá para o repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source** (Fonte):
   - Selecione **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Clique em **Save**

### 3. Aguardar Deploy

- O GitHub Pages levará alguns minutos para fazer o deploy
- Você receberá uma URL como: `https://seu-usuario.github.io/trie-form-autocomplete/`
- A página será atualizada automaticamente a cada push para a branch main

## 📁 Estrutura para GitHub Pages

A estrutura atual já está otimizada para GitHub Pages:

```
trie-form-autocomplete/
├── index.html              ✅ Na raiz (GitHub Pages busca aqui)
├── css/
│   └── styles.css         ✅ Caminho relativo
├── src/
│   └── main.js            ✅ Módulos ES6 funcionam
└── examples/
    └── basic-example.html  ✅ Exemplos acessíveis
```

## ⚙️ Configurações Importantes

### Caminhos Relativos

Todos os caminhos no projeto usam referências relativas:

```html
<!-- index.html -->
<link rel="stylesheet" href="css/styles.css">
<script type="module" src="./src/main.js"></script>

<!-- examples/basic-example.html -->
<link rel="stylesheet" href="../css/styles.css">
<script type="module" src="../src/main.js"></script>
```

### Módulos ES6

Os módulos ES6 funcionam nativamente no GitHub Pages:

```javascript
// Importações funcionam normalmente
import TrieAutocomplete from './src/main.js';
```

## 🔄 Workflow de Desenvolvimento

### Desenvolvimento Local

```bash
# Inicie servidor local
npm run dev

# Ou use qualquer servidor HTTP
python -m http.server 8080
# ou
npx http-server . -p 8080
```

### Publicar Alterações

```bash
# 1. Fazer alterações no código
# 2. Testar localmente

# 3. Commit das alterações
git add .
git commit -m "Descrição das alterações"

# 4. Push para GitHub
git push origin main

# 5. Aguardar deploy automático (1-2 minutos)
```

## 🎨 Personalizar URL (Opcional)

### Usar Domínio Customizado

Se você tem um domínio próprio:

1. Vá em **Settings > Pages**
2. Em **Custom domain**, digite seu domínio
3. Clique em **Save**
4. Configure DNS do seu domínio:
   - Tipo: `CNAME`
   - Nome: `@` ou `www`
   - Valor: `seu-usuario.github.io`

### Usar Subdomínio do GitHub

Por padrão, a URL será:
```
https://seu-usuario.github.io/trie-form-autocomplete/
```

## 📊 Monitoramento

### Verificar Status do Deploy

1. Vá para o repositório no GitHub
2. Clique na aba **Actions**
3. Veja o status do workflow `pages-build-deployment`

### Erros Comuns

#### ❌ Página não carrega
- Verifique se o `index.html` está na raiz
- Confirme que o deploy foi concluído em **Actions**

#### ❌ Módulos ES6 não funcionam
- GitHub Pages suporta ES6, mas precisa de caminhos corretos
- Use sempre caminhos relativos: `./src/main.js`

#### ❌ CSS não carrega
- Verifique o caminho no HTML: `href="css/styles.css"`
- Confirme que a pasta `css/` existe na raiz

#### ❌ 404 ao acessar exemplos
- Certifique-se de usar a URL completa:
  ```
  https://seu-usuario.github.io/trie-form-autocomplete/examples/basic-example.html
  ```

## 🔒 Configurações de Segurança

### HTTPS

- GitHub Pages usa HTTPS por padrão
- Certifique-se de marcar **Enforce HTTPS** em Settings > Pages

### Permissões

- O repositório pode ser público ou privado
- Para privado, você precisa do GitHub Pro

## 📱 Testes Pós-Deploy

Após o deploy, teste:

- ✅ Página principal carrega
- ✅ CSS está aplicado
- ✅ Console sem erros
- ✅ Módulos ES6 funcionam
- ✅ Exemplos são acessíveis
- ✅ Funciona em mobile

## 🌐 SEO e Metadados (Opcional)

Adicione ao `<head>` do `index.html`:

```html
<!-- Open Graph -->
<meta property="og:title" content="Trie Form Autocomplete">
<meta property="og:description" content="Autocomplete usando estrutura de dados Trie">
<meta property="og:url" content="https://seu-usuario.github.io/trie-form-autocomplete/">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Trie Form Autocomplete">
<meta name="twitter:description" content="Autocomplete usando estrutura de dados Trie">

<!-- Description -->
<meta name="description" content="Implementação de autocomplete para formulários HTML usando estrutura de dados Trie em JavaScript puro">
```

## 📈 Analytics (Opcional)

Para monitorar acessos, adicione Google Analytics:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## ✅ Checklist de Deploy

Antes de fazer o deploy final:

- [ ] `index.html` está na raiz
- [ ] Todos os caminhos são relativos
- [ ] Testou localmente com servidor HTTP
- [ ] README.md atualizado com URL da demo
- [ ] Sem erros no console
- [ ] Implementação básica funcionando
- [ ] CSS carregando corretamente
- [ ] Módulos ES6 funcionando
- [ ] Responsivo (mobile/desktop)
- [ ] GitHub Pages configurado

## 🎉 Pronto!

Seu projeto agora está online e acessível para todos!

Para atualizar:
1. Faça alterações no código
2. Commit e push
3. Aguarde deploy automático

---

**URL do seu projeto**: `https://seu-usuario.github.io/trie-form-autocomplete/`

**Documentação GitHub Pages**: https://docs.github.com/pt/pages



