# Next.js 15 Scaffold

A production-ready Next.js 15 scaffold with App Router, Tailwind CSS 4, and essential dependencies.

## Features

- ⚡ **Next.js 15.1.5** - Latest Next.js with App Router
- ⚛️ **React 19** - Latest React with concurrent features
- 🎨 **Tailwind CSS 4.1.13** - Utility-first CSS framework
- 🔐 **Authentication Ready** - JWT and bcryptjs configured
- 💾 **MongoDB Ready** - Mongoose configured
- ✅ **Validation Ready** - Zod for schema validation
- 📱 **Responsive Design** - Mobile-first approach
- 🔧 **TypeScript Support** - Full TypeScript configuration
- 📦 **Modern Packages** - Latest versions of popular libraries

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Start production server**
   ```bash
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server on port 3000
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/            # Reusable components (to be generated)
├── lib/                   # Utilities (to be generated)
├── models/                # Database models (to be generated)
├── package.json
├── next.config.js
├── tsconfig.json
└── .eslintrc.json
```

## Dependencies

### Production
- `next` - Next.js framework
- `react` & `react-dom` - React library
- `tailwindcss` - CSS framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `zod` - Schema validation
- `axios` - HTTP client
- `react-hook-form` - Form handling
- `lucide-react` - Icons
- `react-hot-toast` - Toast notifications
- `clsx` & `tailwind-merge` - Utility functions

### Development
- `typescript` - TypeScript support
- `eslint` & `eslint-config-next` - Linting
- `@types/*` - TypeScript definitions

## Configuration

### Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Your App Name
```

## Next Steps

This scaffold provides the base structure. You can now:

1. Add API routes in `app/api/`
2. Create pages in `app/` directory
3. Add components in `components/` directory
4. Create database models in `models/` directory
5. Add utilities in `lib/` directory

## License

IVC Ventures International Innovation Pvt Ltd (IVC Ventures) Confidential.

