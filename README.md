# E-Commerce CRUD Assignment

Clothing e-commerce platform with a full REST API and modern UI.

## IMPORTANT: Troubleshooting Build Error
If you see "Cannot find module 'tailwindcss'", it is because Next.js/Turbopack is detecting a `package-lock.json` in your user home directory (`C:\Users\bossPC`).

**Solution:**
1. Delete or move `C:\Users\bossPC\package-lock.json` and `C:\Users\bossPC\package.json`.
2. Delete the `.next` folder in this project: `rmdir /s /q .next`
3. Run `npm run dev` again.

## Tech Stack
...
