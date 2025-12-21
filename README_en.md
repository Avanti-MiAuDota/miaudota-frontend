# 🐾 MiAuDota? - Frontend

> 🌍 **Language:** English | [Português](./README.md)

This is the frontend of the **MiAuDota?** system, a modern and intuitive React application designed to facilitate pet adoption, efficiently and securely connecting shelters with adopters.

## 📋 About the Project

MiAuDota? is a complete pet adoption platform that aims to:

- 🏠 Connect shelters and NGOs with potential adopters
- 🐕 Facilitate the adoption process through a matching system
- 📱 Provide a responsive and accessible experience
- 💌 Integrate direct communication between shelters and adopters

## 📂 Project Structure

```
├── public/                # Public files (favicon, images)
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # Reusable components (Header, Footer, etc)
│   ├── contexts/          # React contexts (e.g.: AuthContext)
│   ├── pages/             # Main application pages
│   ├── services/          # API services and integrations
│   ├── utils/             # Utility functions and validations
│   ├── App.jsx            # Main routing component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles (Tailwind)
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## 🚀 Main Technologies

- **[React](https://react.dev/) 19** - JavaScript library for user interfaces
- **[Vite](https://vitejs.dev/)** - Ultra-fast build tool and dev server
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Router DOM](https://reactrouter.com/)** - Declarative routing
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client
- **[React Hook Form](https://react-hook-form.com/)** - Performant form management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[EmailJS](https://www.emailjs.com/)** - Send emails directly from client

## 📦 Available Scripts

In the project directory, you can run:

### `npm install`

Installs all project dependencies.

### `npm run dev`

Starts the development server. Open [http://localhost:5173](http://localhost:5173) to view in the browser.

### `npm run build`

Creates an optimized production build in the `dist/` folder.

### `npm run preview`

Previews the production build locally.

### `npm run lint`

Runs ESLint to check code issues.

## 🔗 Related Repositories

- **Backend:** [miaudota-backend](https://github.com/Avanti-MiAuDota/miaudota-backend)
- **Frontend:** [miaudota-frontend](https://github.com/Avanti-MiAuDota/miaudota-frontend) (this repository)

## 🛠️ How to Run the Project

### Prerequisites

- **Node.js** 18 or higher
- **NPM** or **Yarn**
- **MiAuDota Backend** running (see instructions below)

### 1. Setting up the Backend

First, clone and configure the backend:

```sh
git clone https://github.com/Avanti-MiAuDota/miaudota-backend.git
cd miaudota-backend
```

Follow the backend README instructions to:

- Configure the database
- Install dependencies
- Set up environment variables

Start the backend:

```sh
npm start
```

The backend should be running at `http://localhost:8080`

### 2. Setting up the Frontend

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Avanti-MiAuDota/miaudota-frontend.git
   cd miaudota-frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   ```sh
   cp .env.example .env
   ```

   Edit the `.env` file as needed:

   ```properties
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Start the development server:**

   ```sh
   npm run dev
   ```

5. **Access in browser:**
   [http://localhost:5173](http://localhost:5173)

## 🗺️ Route Structure

The main application routes are:

- `/` — Home
- `/about` — About
- `/login` — Login
- `/register` — Sign up
- `/pets` — Pet listing
- `/pets/:id` — Pet profile
- `/pets/add` — Pet registration
- `/mypets` — My pets
- `/mypets/edit/:id` — Edit pet
- `/mypets/adoptions/:petId` — Pet adoptions
- `/pets/adopt/:petId` — Adoption form
- `/congratulations` — Match screen
- `/401` — Unauthorized
- `*` — Page not found

## 📧 EmailJS Integration

This application uses **EmailJS** to send contact form messages directly to a configured email. Follow the steps below to configure:

### 1. Dependency Installation

```bash
npm install @emailjs/browser
```

### 2. Environment Variables Configuration

Create/edit the `.env` file at the project root and add:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> **⚠️ Notes:**
>
> - Vite only exposes variables starting with `VITE_`
> - Restart the server after editing `.env`

### 3. EmailJS Template Configuration

In the EmailJS panel, configure the template with the following variables:

- `from_name`
- `from_email`
- `message`

Set the recipient email in the template's "To" field.

### 4. Implementation

The contact component is at [src/components/Contact.jsx](src/components/Contact.jsx) and implements:

- ✅ Local field validation
- 📤 Sending via `emailjs.send()`
- 🔔 Visual feedback with toasts

## 👥 Development Team

- [André](https://github.com/Mordev-tech)
- [Daniel](https://github.com/danielcooder)
- [Danielle](https://github.com/daniellesena)
- [Flávia](https://github.com/flaviare1s)
- [Vittoria](https://github.com/Vittoriaalopes)
