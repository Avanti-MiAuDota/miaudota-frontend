# MiAuDota? - Frontend

Este é o frontend do sistema **MiAuDota?**, uma aplicação React para facilitar a adoção de pets, conectando abrigo a adotantes.

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

## Principais Tecnologias

- [React](https://react.dev/) 19
- [Vite](https://vitejs.dev/) para build e dev server
- [TailwindCSS](https://tailwindcss.com/) para estilização
- [React Router DOM](https://reactrouter.com/) para roteamento
- [Axios](https://axios-http.com/) para requisições HTTP
- [React Hook Form](https://react-hook-form.com/) para formulários
- [Zod](https://zod.dev/) para validação

## Scripts Disponíveis

No diretório do projeto, você pode rodar:

### `npm install`

Instala todas as dependências do projeto.

### `npm run dev`

Roda o app em modo desenvolvimento. Abra [http://localhost:5173](http://localhost:5173) para ver no navegador.

## Repositórios Relacionados

- **Backend:** [miaudota-backend](https://github.com/Avanti-MiAuDota/miaudota-backend)
- **Frontend:** [miaudota-frontend](https://github.com/Avanti-MiAuDota/miaudota-frontend) (este repositório)

## Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Backend do MiAuDota rodando (veja instruções abaixo)

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


## Estrutura de Rotas

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

## Equipe de Desenvolvimento

- [André](https://github.com/Mordev-tech)
- [Daniel](https://github.com/danielcooder)
- [Danielle](https://github.com/daniellesena)
- [Flávia](https://github.com/flaviare1s)
- [Vittoria](https://github.com/Vittoriaalopes)
