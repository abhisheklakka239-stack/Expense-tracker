# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# Expense-tracker

A modern expense tracker built with React, Vite, and Supabase. Features secure authentication, real‑time cloud sync, and a sleek dark dashboard to manage daily spending. Add, edit, and analyze expenses effortlessly with category insights and demo mode support.
Users begin with a secure login flow using Supabase Auth. The app supports email and password authentication, along with signup for new users. Once authenticated, users are redirected to a sleek, dark‑themed dashboard that provides real‑time insights into their spending. The dashboard is designed for clarity and usability, showing expenses categorized by type and payment mode, making it easy to analyze financial habits.

Expense data is stored in a PostgreSQL database hosted on Supabase. The schema includes fields for title, amount, category, payment mode, and timestamps, ensuring structured and reliable data storage. This setup allows for efficient queries and analytics, while Supabase handles authentication and database management securely in the background.

Key features include:

🔐 Authentication: Secure login and signup with Supabase Auth.

📊 Dashboard: Real‑time expense visualization with category breakdowns.

☁️ Cloud Sync: Automatic storage and retrieval of expenses from Supabase.

🌙 Dark Theme: Minimal, responsive design optimized for clarity.

🧾 Expense Management: Add, edit, and track transactions effortlessly.

🧠 Demo Mode: Explore the app without signing in.

The project is structured for easy setup and deployment. Developers can clone the repository, configure Supabase credentials in environment variables, and run the app locally with npm run dev. Deployment is straightforward with platforms like Vercel or Netlify, making it accessible for both learning and production use.

This Expense Tracker is ideal for anyone interested in learning full‑stack development with Supabase or for users who want a practical tool to manage their finances. It highlights how authentication, database integration, and modern UI design can come together to create a secure, scalable, and user‑friendly application.
