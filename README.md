An anonymous messaging app built with Next.js. Users sign up, verify their email, get a public profile link, and receive anonymous messages from anyone.

Features
Sign up with username, email and password
Real-time username availability check (debounced)
Email verification with a one-time code
Sign in with NextAuth (credentials)
Dashboard to view and delete received messages
Toggle to accept or stop accepting messages
Send anonymous messages to any user via their public link
AI-suggested message ideas
Form validation with Zod
Tech Stack
Framework: Next.js (App Router) + TypeScript
Styling: Tailwind CSS + shadcn/ui
Auth: NextAuth.js
Database: MongoDB + Mongoose
Forms and validation: React Hook Form + Zod
HTTP client: Axios
Notifications: Sonner
Utilities: usehooks-ts, lucide-react



src/
  app/
    (auth)/
      sign-in/page.tsx
      sign-up/page.tsx
      verify/[username]/page.tsx
    api/
      accept-messages/
      auth/
      checkUsernameUniques/
      delete-message/
      getMessages/
      sendMessage/
      sign-up/
      suggest-messages/
      verifyCode/
    layout.tsx
    page.tsx
  components/
    ui/            # shadcn/ui components
    Messagecard.tsx
    Navbar.tsx
  context/         # Auth session provider
  helpers/         # Email sending helpers
  lib/             # DB connection, utils
  middleware.ts    # Route protection
  models/          # Mongoose models
  schemas/         # Zod schemas
  types/           # TypeScript types