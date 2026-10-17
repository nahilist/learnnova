# LearnNova

LearnNova is a Next.js AI learning workspace with Firebase Authentication.

## Firebase Authentication Setup

1. Create a Firebase project and register a Web app.
2. In Firebase Console, open **Authentication → Sign-in method** and enable:
   - Email/Password
   - Google
   - Apple (requires Apple Developer configuration)
3. Copy `.env.example` to `.env.local` and add the Firebase Web app config values.
4. Add your local and deployed hosts under **Authentication → Settings → Authorized domains**.

Firebase Web API keys are public client identifiers. Do not add Firebase Admin service-account credentials to any `NEXT_PUBLIC_` variable.
<<<<<<< HEAD

## Cloud Firestore Setup

1. In Firebase Console, open **Build -> Firestore Database** and create a database.
2. Choose a production location close to your users.
3. Open the **Rules** tab, replace its contents with [`firestore.rules`](./firestore.rules), and publish the rules.

The authenticated workspace creates `users/{uid}` and stores each user's spaces and documents in private subcollections. The included rules only allow a signed-in user to access data under their own UID.
=======
>>>>>>> 5d66da33deeec2530ed911f657e3f8b838d87124

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The `/app` route redirects unauthenticated users to `/signin`.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
