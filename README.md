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
