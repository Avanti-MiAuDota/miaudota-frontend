# 🐾 MiAuDota? - Frontend

> 🌍 **Language:** [English](./README_en.md) | **Português**

Este é o frontend do sistema **MiAuDota?**, uma aplicação React moderna e intuitiva para facilitar a adoção de pets, conectando abrigos a adotantes de forma eficiente e segura.

## 📋 Sobre o Projeto

MiAuDota? é uma plataforma completa de adoção de pets que visa:

- 🏠 Conectar abrigos e ONGs com potenciais adotantes
- 🐕 Facilitar o processo de adoção através de um sistema de match
- 📱 Proporcionar uma experiência responsiva e acessível
- 💌 Integrar comunicação direta entre abrigos e adotantes

## Estrutura do Projeto

```
├── public/                # Arquivos públicos (favicon, imagens)
├── src/
│   ├── assets/            # Imagens e outros assets
│   ├── components/        # Componentes reutilizáveis (Header, Footer, etc)
│   ├── contexts/          # Contextos React (ex: AuthContext)
│   ├── pages/             # Páginas principais da aplicação
│   ├── services/          # Serviços de API e integração
│   ├── utils/             # Funções utilitárias e validações
│   ├── App.jsx            # Componente principal de rotas
│   ├── main.jsx           # Ponto de entrada da aplicação
│   └── index.css          # Estilos globais (Tailwind)
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
├── eslint.config.js       # Configuração do ESLint
├── vercel.json            # Configuração de deploy na Vercel
└── README.md              # Este arquivo
```

## 🚀 Principais Tecnologias

- **[React](https://react.dev/) 19** - Biblioteca JavaScript para interfaces de usuário
- **[Vite](https://vitejs.dev/)** - Build tool e dev server ultrarrápido
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[React Router DOM](https://reactrouter.com/)** - Roteamento declarativo
- **[Axios](https://axios-http.com/)** - Cliente HTTP baseado em Promises
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento performático de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[EmailJS](https://www.emailjs.com/)** - Envio de emails direto do cliente
  📦 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm install`

Instala todas as dependências do projeto.

### `npm run dev`

Inicia o servidor de desenvolvimento. Abra [http://localhost:5173](http://localhost:5173) para visualizar no navegador.

### `npm run build`

Cria a build de produção otimizada na pasta `dist/`.

###🔗 `npm run preview`
Visualiza a build de produção localmente.

### `npm run lint`

Executa o ESLint para verificar problemas no código
Roda o app em modo desenvolvimento. Abra [http://localhost:5173](http://localhost:5173) para ver no navegador.

## Repositórios Relacionados

- **Backend:** [miaudota-backend](https://github.com/Avanti-MiAuDota/miaudota-backend)
- **Frontend:** [miaudota-frontend](https://github.com/Avanti-MiAuDota/miaudota-frontend) (este repositório)

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- **Node.js** 18 ou superior
- **NPM** ou **Yarn**
- **Backend do MiAuDota** rodando (veja instruções abaixo)

### 1. Configurando o Backend

Primeiro, clone e configure o backend:

```sh
git clone https://github.com/Avanti-MiAuDota/miaudota-backend.git
cd miaudota-backend
```

Siga as instruções do README do backend para:

- Configurar o banco de dados
- Instalar dependências
- Configurar variáveis de ambiente

Inicie o backend:

```sh
npm start
```

O backend deve estar rodando em `http://localhost:8080`

### 2. Configurando o Frontend

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/Avanti-MiAuDota/miaudota-frontend.git
   cd miaudota-frontend
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   ```sh
   cp .env.example .env
   ```

   Edite o arquivo `.env` conforme necessário:

   ```properties
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```sh
   npm run dev
   ```

5. **Acesse no navegador:**
   [http://localhost:5173](http://localhost:5173)

## 🗺️ Estrutura de Rotas

As principais rotas da aplicação são:

- `/` — Home
- `/about` — Sobre
- `/login` — Login
- `/register` — Cadastro
- `/pets` — Listagem de pets
- `/pets/:id` — Perfil do pet
- `/pets/add` — Cadastro de pet
- `/mypets` — Meus pets
- `/mypets/edit/:id` — Editar pet
- `/mypets/adoptions/:petId` — Adoções do pet
- `/pets/adopt/:petId` — Formulário de adoção
- `/congratulations` — Tela de match
- `/401` — Não autorizado
- `*` — Página não encontrada

## 📧 Integração com EmailJS

Esta aplicação usa **EmailJS** para enviar mensagens do formulário de contato diretamente para um e-mail configurado. Siga o passo a passo abaixo para configurar:

### 1. Instalação da Dependência

```bash
npm install @emailjs/browser
```

### 2. Configuração das Variáveis de Ambiente

Crie/edite o arquivo `.env` na raiz do projeto e adicione:
env
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=seu_public_key

```

> **⚠️ Observações:**
> - O Vite expõe apenas variáveis que começam com `VITE_`
> - Reinicie o servidor após editar o `.env`

### 3. Configuração do Template no EmailJS

No painel do EmailJS, configure o template com as seguintes variáveis:
- `from_name`
- `from_email`
- `message`

Configure o e-mail destinatário no campo "To" do template.

### 4. Implementação

O componente de contato está em [src/components/Contact.jsx](src/components/Contact.jsx) e implementa:
- ✅ Validação local de campos
- 📤 Envio via `emailjs.send()`
- 🔔 Feedback visual com toasts

## 👥 Equipe de Desenvolvimento

- [André](https://github.com/Mordev-tech)
- [Daniel](https://github.com/danielcooder)
- [Danielle](https://github.com/daniellesena)
- [Flávia](https://github.com/flaviare1s)
- [Vittoria](https://github.com/Vittoriaalopes)
```
