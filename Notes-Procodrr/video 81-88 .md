# 📚 Complete Next.js Course Notes — SET 9 (FINAL SET)

### Videos 81–88 | By Anurag Singh (ProCodrr)

---

# 🌍 VIDEO 81: Internationalization (i18n) in Next.js (S12 Ep.4)

## What is Internationalization (i18n)?

> **Internationalization (i18n)** is the process of designing your app to support **multiple languages and locales** — making it accessible to users worldwide.

```
i18n = internationalization
(18 letters between 'i' and 'n')

l10n = localization
(actual translation of content)

Example:
English:  /en/about  → "About Us"
French:   /fr/about  → "À propos de nous"
Arabic:   /ar/about  → "معلومات عنا" (RTL layout)
```

## i18n Concepts:

```
Locale   = Language + Region code
en       = English (generic)
en-US    = English (United States)
en-GB    = English (United Kingdom)
fr       = French
fr-FR    = French (France)
ar       = Arabic
zh-CN    = Chinese (Simplified)
ja       = Japanese

URL Strategies:
/en/about    → Subdirectory (most common)
en.site.com  → Subdomain
site.com?lang=en → Query param (not recommended)
```

## Setting Up i18n with Middleware:

```js
// middleware.js
import { NextResponse } from "next/server";

// Supported locales
const locales = ["en", "fr", "ar", "es", "de"];
const defaultLocale = "en";

// Get preferred locale from browser
function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) return defaultLocale;

  // Parse accept-language header
  // Example: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
  const preferredLocales = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().split("-")[0]);

  // Find first supported locale
  const matched = preferredLocales.find((lang) => locales.includes(lang));

  return matched || defaultLocale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to locale-prefixed URL
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
```

## Folder Structure for i18n:

```
app/
├── [locale]/                    ← Dynamic locale segment
│   ├── layout.js               ← Locale layout (sets lang attr)
│   ├── page.js                 → / (home in chosen locale)
│   ├── about/
│   │   └── page.js             → /about
│   └── contact/
│       └── page.js             → /contact
└── middleware.js
```

## Translation Files:

```js
// messages/en.json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "home": {
    "title": "Welcome to Our App",
    "subtitle": "Build amazing things",
    "cta": "Get Started"
  },
  "auth": {
    "login": "Sign In",
    "register": "Create Account",
    "logout": "Sign Out"
  }
}
```

```js
// messages/fr.json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "contact": "Contact"
  },
  "home": {
    "title": "Bienvenue dans notre application",
    "subtitle": "Créez des choses incroyables",
    "cta": "Commencer"
  },
  "auth": {
    "login": "Se connecter",
    "register": "Créer un compte",
    "logout": "Se déconnecter"
  }
}
```

## Translation Helper:

```js
// lib/i18n.js

// Load translations for a given locale
export async function getDictionary(locale) {
  const validLocales = ["en", "fr", "ar", "es", "de"];
  const safeLocale = validLocales.includes(locale) ? locale : "en";

  try {
    const dict = await import(`../messages/${safeLocale}.json`);
    return dict.default;
  } catch {
    // Fallback to English
    const dict = await import("../messages/en.json");
    return dict.default;
  }
}
```

## Locale Layout:

```jsx
// app/[locale]/layout.js
import { getDictionary } from "@/lib/i18n";

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "fr" },
    { locale: "ar" },
    { locale: "es" },
  ];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // RTL languages
  const rtlLocales = ["ar", "he", "fa"];
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

## Using Translations in Pages:

```jsx
// app/[locale]/page.js
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";

export default async function HomePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.subtitle}</p>
      <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
      <button>{dict.home.cta}</button>
    </main>
  );
}
```

## Language Switcher Component:

```jsx
// components/LanguageSwitcher.jsx
"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function LanguageSwitcher({ currentLocale }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(newLocale) {
    // Replace current locale in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale; // Replace locale segment
    const newPath = segments.join("/");
    router.push(newPath);
  }

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            currentLocale === lang.code
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}
```

## Using `next-intl` Library (Recommended for Production):

```bash
npm install next-intl
```

```js
// next.config.js
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
```

---

# 🔐 VIDEO 82: Implementing Google Login with Auth.js (S12 Ep.5)

## What is Auth.js?

> **Auth.js** (formerly NextAuth.js) is an authentication library for Next.js that provides pre-built support for 50+ OAuth providers (Google, GitHub, Facebook, etc.)

```bash
npm install next-auth@beta
```

## Environment Variables:

```bash
# .env.local
AUTH_SECRET=your-random-secret-min-32-chars

# Google OAuth credentials
# Get from: console.cloud.google.com
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

NEXTAUTH_URL=http://localhost:3000
```

## Google OAuth Setup:

```
Steps in Google Cloud Console:
1. Go to console.cloud.google.com
2. Create new project (or select existing)
3. Go to APIs & Services → Credentials
4. Click "Create Credentials" → OAuth Client ID
5. Application type: Web application
6. Add Authorized redirect URIs:
   http://localhost:3000/api/auth/callback/google
   https://yourapp.com/api/auth/callback/google
7. Copy Client ID and Client Secret
8. Add to .env.local
```

## Auth.js Configuration:

```js
// auth.js (in project root)
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  // Use JWT strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  callbacks: {
    // Called when JWT is created/updated
    async jwt({ token, user, account }) {
      if (account && user) {
        // First sign in — save to database
        try {
          await connectDB();

          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
              provider: account.provider,
            });
          }

          token.userId = dbUser._id.toString();
          token.role = dbUser.role;
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      return token;
    },

    // Called when session is checked
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
```

## Route Handler for Auth.js:

```js
// app/api/auth/[...nextauth]/route.js
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

## Auth Provider (Client Component):

```jsx
// components/AuthProvider.jsx
"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```jsx
// app/layout.js
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Google Login Button:

```jsx
// components/GoogleLoginButton.jsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3
                 border border-gray-300 rounded-lg px-6 py-3
                 hover:bg-gray-50 transition-colors font-medium
                 disabled:opacity-50"
    >
      {/* Google Icon SVG */}
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26
             1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92
             3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23
             1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
             20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
             8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09
             14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6
             3.3-4.53 6.16-4.53z"
        />
      </svg>
      {loading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
```

## Getting Session in Server Components:

```jsx
// app/dashboard/page.jsx — Server Component
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{session.user?.name}</h2>
            <p className="text-gray-500">{session.user?.email}</p>
            <p className="text-sm text-blue-500">
              Role: {session.user?.role || "user"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Getting Session in Client Components:

```jsx
// components/UserMenu.jsx
"use client";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (!session) {
    return (
      <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Sign In
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-8 h-8 rounded-full"
        />
      )}
      <span className="text-sm font-medium">{session.user?.name}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-red-500 hover:underline"
      >
        Sign Out
      </button>
    </div>
  );
}
```

## Middleware Protection with Auth.js:

```js
// middleware.js
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/todos/:path*"],
};
```

---

# 🔍 VIDEO 83: ESLint Deep Dive with Next.js and TypeScript (S13 Ep.1)

## What is ESLint?

> **ESLint** is a static code analysis tool that finds and fixes problems in JavaScript/TypeScript code — enforcing coding standards and catching bugs before runtime.

```
Without ESLint:
→ Inconsistent code style across team
→ Missing error handling caught only at runtime
→ Unused variables wasting memory
→ Potential bugs caught too late

With ESLint:
→ Consistent code style enforced automatically
→ Bugs caught at development time
→ Code quality rules enforced
→ IDE shows errors instantly
```

## Default Next.js ESLint Config:

```json
// .eslintrc.json (default in Next.js)
{
  "extends": "next/core-web-vitals"
}
```

## Enhanced ESLint Configuration:

```bash
# Install additional ESLint plugins
npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import
```

```json
// .eslintrc.json — Complete configuration
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",

    // React rules
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "warn",

    // React Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Import rules
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/no-duplicates": "error",

    // General rules
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "ignorePatterns": ["node_modules/", ".next/", "out/", "build/", "*.config.js"]
}
```

## ESLint Rules Explanation:

```
Rule Severity:
"off"   or 0 → Disable rule
"warn"  or 1 → Show warning (doesn't fail build)
"error" or 2 → Show error (fails build/CI)

Important Rules:
─────────────────────────────────────────────────────
no-unused-vars    → Variables declared but never used
no-console        → Prevent console.log in production
prefer-const      → Use const over let when not reassigned
eqeqeq            → Use === instead of ==
no-var            → Use let/const instead of var
react-hooks/rules-of-hooks → Hooks must follow rules
react-hooks/exhaustive-deps → useEffect dependencies
```

## Running ESLint:

```bash
# Check for errors
npm run lint

# Auto-fix fixable errors
npm run lint -- --fix

# Check specific file
npx eslint app/page.jsx

# Check entire app directory
npx eslint app/
```

## ESLint in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "lint:strict": "next lint --max-warnings 0"
  }
}
```

---

# 🎨 VIDEO 84: Using ESLint as Formatter in Next.js (S13 Ep.2)

## ESLint for Formatting

> While Prettier is the standard formatter, you can use **ESLint itself** for formatting with `eslint-stylistic` plugin.

```bash
npm install --save-dev @stylistic/eslint-plugin
```

## ESLint Stylistic Configuration:

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "plugin:@stylistic/recommended"],
  "plugins": ["@stylistic"],
  "rules": {
    // Indentation
    "@stylistic/indent": ["error", 2],

    // Quotes
    "@stylistic/quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": false
      }
    ],

    // Semicolons
    "@stylistic/semi": ["error", "always"],

    // Trailing commas
    "@stylistic/comma-dangle": ["error", "always-multiline"],

    // Spacing
    "@stylistic/space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }
    ],

    // Arrow function parens
    "@stylistic/arrow-parens": ["error", "always"],

    // Max line length
    "@stylistic/max-len": [
      "warn",
      {
        "code": 100,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true
      }
    ],

    // Object spacing
    "@stylistic/object-curly-spacing": ["error", "always"],

    // Array spacing
    "@stylistic/array-bracket-spacing": ["error", "never"],

    // JSX quotes
    "@stylistic/jsx-quotes": ["error", "prefer-double"],

    // JSX self-closing
    "@stylistic/jsx-self-closing-comp": [
      "error",
      {
        "component": true,
        "html": true
      }
    ]
  }
}
```

---

# ✨ VIDEO 85: Prettier Setup in Next.js (S13 Ep.3)

## What is Prettier?

> **Prettier** is an opinionated code formatter that enforces consistent styling automatically — removing all debates about code style.

```bash
# Install Prettier and ESLint integration
npm install --save-dev \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier
```

## Prettier Configuration:

```json
// .prettierrc.json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false,
  "bracketSameLine": false,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "embeddedLanguageFormatting": "auto"
}
```

## Prettier Ignore File:

```
# .prettierignore
node_modules/
.next/
out/
build/
public/
*.min.js
*.min.css
package-lock.json
yarn.lock
```

## Integrating Prettier with ESLint:

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "semi": true,
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "all",
        "printWidth": 100
      }
    ]
  }
}
```

## Prettier Scripts:

```json
// package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "next lint",
    "lint:fix": "next lint --fix"
  }
}
```

## VS Code Integration:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## VS Code Extensions Needed:

```
Required Extensions:
1. ESLint (dbaeumer.vscode-eslint)
2. Prettier (esbenp.prettier-vscode)

Install via:
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

---

# 🔬 VIDEO 86: Setting Up Lint-Staged in Next.js (S13 Ep.4)

## What is Lint-Staged?

> **Lint-Staged** runs linters and formatters **only on staged files** (files you're about to commit) — making checks fast by not processing the entire codebase.

```
Without Lint-Staged:
git commit → ESLint checks ALL files → Slow ❌

With Lint-Staged:
git commit → ESLint checks ONLY staged files → Fast ✅
```

## Installation:

```bash
npm install --save-dev lint-staged
```

## Configuration Options:

### Option 1: In `package.json`

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,scss,md}": ["prettier --write"],
    "*.{ts,tsx}": ["tsc --noEmit"]
  }
}
```

### Option 2: Separate Config File

```js
// lint-staged.config.js
const config = {
  // JavaScript and TypeScript files
  "*.{js,jsx,ts,tsx}": (filenames) => [
    `eslint --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],

  // CSS and styling files
  "*.{css,scss,sass}": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
  ],

  // JSON and Markdown files
  "*.{json,md,mdx}": (filenames) => [`prettier --write ${filenames.join(" ")}`],
};

export default config;
```

## How Lint-Staged Works:

```
Workflow:
1. Developer makes changes to files
2. git add . (stage files)
3. git commit (triggers lint-staged via Husky)
4. lint-staged finds ONLY staged .js/.ts files
5. Runs eslint --fix on those files
6. Runs prettier --write on those files
7. If any errors remain → commit BLOCKED ❌
8. If all pass → commit succeeds ✅
```

---

# 🐶 VIDEO 87: Husky Setup in Next.js (S13 Ep.5)

## What is Husky?

> **Husky** makes it easy to use **Git hooks** — scripts that run automatically at specific Git events (before commit, before push, etc.)

```
Git Hooks available:
pre-commit   → Runs before git commit
commit-msg   → Validates commit message
pre-push     → Runs before git push
post-merge   → Runs after git merge

Husky makes these easy to configure and share across team!
```

## Installation:

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky init
```

## Husky v9 Setup:

```bash
# This creates .husky/ folder and adds prepare script
npx husky init
```

```json
// package.json — prepare script auto-added
{
  "scripts": {
    "prepare": "husky",
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "format": "prettier --write ."
  }
}
```

## Creating Git Hooks:

### Pre-commit Hook (Run Lint-Staged):

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running lint-staged..."
npx lint-staged

echo "✅ Pre-commit checks passed!"
```

### Commit Message Hook:

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Enforce conventional commits format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,100}'

if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Valid format: type(scope): description"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, test, chore"
  echo ""
  echo "Examples:"
  echo "  feat: add user authentication"
  echo "  fix(auth): resolve login redirect issue"
  echo "  docs: update README with setup instructions"
  exit 1
fi

echo "✅ Commit message format valid!"
```

### Pre-push Hook (Run Tests):

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."
npm run test

echo "🏗️ Running type check..."
npx tsc --noEmit

echo "✅ Pre-push checks passed!"
```

## Complete Industry Setup Workflow:

```
Complete Quality Pipeline:
──────────────────────────────────────────

Developer writes code
        ↓
git add . (stage files)
        ↓
git commit -m "feat: add login"
        ↓
[Husky] pre-commit hook fires
        ↓
[Lint-Staged] runs on staged files only:
  → ESLint --fix (auto-fix linting issues)
  → Prettier --write (auto-format code)
        ↓
[Husky] commit-msg hook fires:
  → Validates "feat: add login" format ✅
        ↓
Commit saved to local repository
        ↓
git push origin main
        ↓
[Husky] pre-push hook fires:
  → Run TypeScript type check
  → Run test suite
        ↓
Code pushed to GitHub ✅
        ↓
[Vercel] Auto-deployment triggered
        ↓
Live on production 🚀
```

## Conventional Commits Reference:

```
Format: type(scope): description

TYPES:
feat     → New feature
fix      → Bug fix
docs     → Documentation changes
style    → Formatting (no logic change)
refactor → Code refactoring
test     → Adding/updating tests
chore    → Build process, dependencies
perf     → Performance improvement
ci       → CI/CD configuration
build    → Build system changes
revert   → Reverting a commit

EXAMPLES:
feat: add Google OAuth login
fix(auth): resolve token expiration bug
docs: add API documentation
style: format files with Prettier
refactor(todos): simplify state management
test: add unit tests for auth helpers
chore: update dependencies to latest versions
```

---

# 🎉 VIDEO 88: Course Completion Congratulations!

## What You've Learned — Complete Summary

```
You are now a FULL-STACK Next.js Developer! 🎉

S1 — Foundation:
✅ Next.js concepts and architecture
✅ Project setup with create-next-app
✅ Next.js vs React differences
✅ Server vs Client rendering

S2 — Routing:
✅ File-based routing system
✅ Nested and dynamic routes
✅ Catch-all routes
✅ Layouts and nested layouts
✅ Metadata API for SEO
✅ Custom 404 pages
✅ Route Groups and Private Folders

S3 — Rendering:
✅ CSR, SSR, SSG, ISR paradigms
✅ Static vs Dynamic rendering
✅ generateStaticParams
✅ dynamicParams configuration
✅ Streaming with Suspense

S4 — Components & Data:
✅ Server Components vs Client Components
✅ Hydration and hydration errors
✅ Data fetching strategies
✅ Parallel data fetching
✅ Context API in Next.js
✅ Redux with Next.js

S5 — Error Handling:
✅ error.js boundaries
✅ global-error.js
✅ Error recovery with reset()
✅ Nested error boundaries

S6 — Styling:
✅ Global CSS and CSS Variables
✅ CSS Modules (scoped styles)
✅ SCSS/SASS in Next.js
✅ Tailwind CSS v4
✅ Image optimization with <Image>
✅ Font optimization

S7 — Backend API:
✅ Route Handlers (GET/POST/PUT/DELETE)
✅ Dynamic route handlers
✅ Request object handling
✅ RESTful API design
✅ Complete Todo CRUD API

S8 — Database:
✅ MongoDB Atlas setup
✅ Mongoose models and schemas
✅ CRUD operations with Mongoose
✅ Data validation

S9 — Authentication:
✅ Complete auth flow design
✅ User registration
✅ Password hashing with bcrypt
✅ JWT signing and verification
✅ Session-based auth
✅ Cookie management
✅ Protected routes
✅ Logout implementation

S10 — Deployment:
✅ Production build preparation
✅ Vercel deployment
✅ Custom domain setup
✅ Environment variables in production

S11 — Server Actions:
✅ Server Actions fundamentals
✅ Server Actions in Client Components
✅ useActionState hook
✅ Form validation (manual + Zod)
✅ Auth with Server Actions
✅ Non-form Server Actions

S12 — Advanced Features:
✅ Middleware for auth and routing
✅ URL rewriting
✅ Edge Runtime
✅ Internationalization (i18n)
✅ Google OAuth with Auth.js

S13 — Industry Setup:
✅ ESLint configuration
✅ Prettier code formatting
✅ Lint-Staged for performance
✅ Husky Git hooks
✅ Conventional commits
✅ Complete quality pipeline
```

---

# 📋 COMPLETE COURSE — Master Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│           COMPLETE NEXT.JS COURSE MASTER REFERENCE           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SETUP:                                                      │
│  npx create-next-app@latest my-app                           │
│  npm run dev → localhost:3000                                │
│                                                              │
│  KEY FILES:                                                  │
│  app/layout.js      → Root layout (required)                 │
│  app/page.js        → Home page                              │
│  app/error.js       → Error boundary (use client)            │
│  app/loading.js     → Loading state                          │
│  app/not-found.js   → 404 page                               │
│  middleware.js      → Runs before every request              │
│  next.config.js     → Next.js configuration                  │
│                                                              │
│  ROUTING:                                                    │
│  app/about/page.js          → /about                         │
│  app/[id]/page.js           → /:id (dynamic)                 │
│  app/[...slug]/page.js      → catch-all                      │
│  app/(group)/page.js        → route group (no URL impact)    │
│  app/_folder/               → private folder                 │
│  app/api/todos/route.js     → API endpoint                   │
│                                                              │
│  RENDERING:                                                  │
│  default                    → Static (SSG)                   │
│  cache: 'no-store'          → Dynamic (SSR)                  │
│  next: { revalidate: 60 }   → ISR                            │
│  'use client'               → Client Component               │
│  export const dynamic = 'force-dynamic'                      │
│                                                              │
│  DATA FETCHING:                                              │
│  Server: async function + await fetch()                      │
│  Client: useEffect + fetch OR useFetch hook                  │
│  Parallel: Promise.all([fetch1, fetch2])                     │
│                                                              │
│  SERVER ACTIONS:                                             │
│  'use server' at file top                                    │
│  form action={myAction}                                      │
│  useActionState(action, initialState)                        │
│  revalidatePath('/path')                                     │
│  redirect('/path')                                           │
│                                                              │
│  ROUTE HANDLERS:                                             │
│  export async function GET(request) { }                      │
│  export async function POST(request) { }                     │
│  return Response.json(data, { status: 200 })                 │
│  Dynamic: function GET(req, { params }) { }                  │
│                                                              │
│  AUTH FLOW:                                                  │
│  Register: validate → hash(bcrypt) → save → cookie           │
│  Login: find → compare → signToken(jwt) → cookie             │
│  Protect: cookies() → verifyToken → user                     │
│  Logout: clear cookie → delete session                       │
│                                                              │
│  MIDDLEWARE:                                                 │
│  middleware.js at project root                               │
│  NextResponse.next()     → Continue                          │
│  NextResponse.redirect() → Redirect                          │
│  NextResponse.rewrite()  → Rewrite URL                       │
│  config.matcher          → Which routes to run on            │
│                                                              │
│  INDUSTRY SETUP:                                             │
│  ESLint → Code quality rules                                 │
│  Prettier → Code formatting                                  │
│  Lint-Staged → Check only staged files                       │
│  Husky → Git hooks (pre-commit, commit-msg, pre-push)        │
│  Conventional Commits → type(scope): description             │
│                                                              │
│  i18n:                                                       │
│  app/[locale]/page.js → Dynamic locale routing               │
│  middleware → Detect and redirect to locale                  │
│  getDictionary(locale) → Load translations                   │
│                                                              │
│  AUTH.JS (OAuth):                                            │
│  npm install next-auth@beta                                  │
│  auth.js → NextAuth({ providers: [Google()] })               │
│  app/api/auth/[...nextauth]/route.js                         │
│  auth() → Get session in Server Components                   │
│  useSession() → Get session in Client Components             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 📝 SET 9 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 9 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  i18n SETUP:                                                 │
│  app/[locale]/page.js → locale-based routing                 │
│  middleware → detect locale → redirect                       │
│  getDictionary(locale) → load JSON translations              │
│  generateStaticParams → pre-build all locales                │
│  RTL support: dir={rtlLocales.includes(locale)?'rtl':'ltr'}  │
│                                                              │
│  AUTH.JS (Google Login):                                     │
│  npm install next-auth@beta                                  │
│  AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET             │
│  auth.js → NextAuth config with providers + callbacks        │
│  app/api/auth/[...nextauth]/route.js → handlers              │
│  Server: const session = await auth()                        │
│  Client: const { data: session } = useSession()              │
│  signIn('google', { callbackUrl: '/dashboard' })             │
│  signOut({ callbackUrl: '/' })                               │
│                                                              │
│  ESLINT:                                                     │
│  .eslintrc.json → extends + rules config                     │
│  npm run lint → check errors                                 │
│  npm run lint -- --fix → auto-fix                            │
│  Key rules: no-unused-vars, prefer-const, eqeqeq             │
│                                                              │
│  PRETTIER:                                                   │
│  npm install prettier eslint-config-prettier                 │
│  .prettierrc.json → formatting rules                         │
│  npm run format → format all files                           │
│  eslint-config-prettier → disable conflicting ESLint rules   │
│                                                              │
│  LINT-STAGED:                                                │
│  npm install lint-staged                                     │
│  Config in package.json "lint-staged": { }                   │
│  Runs ONLY on staged files → Fast!                           │
│  "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"]       │
│                                                              │
│  HUSKY:                                                      │
│  npm install husky                                           │
│  npx husky init → creates .husky/ folder                     │
│  .husky/pre-commit → runs lint-staged                        │
│  .husky/commit-msg → validates commit format                 │
│  .husky/pre-push → runs tests + type-check                   │
│                                                              │
│  CONVENTIONAL COMMITS:                                       │
│  feat: new feature                                           │
│  fix: bug fix                                                │
│  docs: documentation                                         │
│  chore: maintenance                                          │
│  refactor: code improvement                                  │
│  test: adding tests                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 🏆 Final Words

## Your Next.js Journey Continues!

```
What to build next:
─────────────────────────────────────────────
✅ Portfolio website with Next.js
✅ E-commerce app (products, cart, checkout)
✅ Blog with CMS integration (Contentful, Sanity)
✅ SaaS application with subscriptions
✅ Real-time chat app (with WebSockets)
✅ Social media clone

Resources to explore:
─────────────────────────────────────────────
📖 Next.js Official Docs: nextjs.org/docs
📖 React Docs: react.dev
📖 Vercel Blog: vercel.com/blog
📖 Auth.js Docs: authjs.dev
📖 Mongoose Docs: mongoosejs.com
📖 Zod Docs: zod.dev

Key concepts to deepen:
─────────────────────────────────────────────
🔹 Testing with Jest + React Testing Library
🔹 TypeScript with Next.js
🔹 WebSockets / real-time features
🔹 Payment integration (Stripe)
🔹 Email sending (Resend, Nodemailer)
🔹 File uploads (UploadThing, Cloudinary)
🔹 Search (Algolia, Elasticsearch)
```
