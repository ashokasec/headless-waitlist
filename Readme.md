# Headless Waitlist

A modern, production-ready waitlist system built with Next.js 15, TypeScript, and PostgreSQL. Perfect for indie hackers and startups looking to collect early user interest.

## Features

- **Built-in Security**: Arcjet integration for bot protection, rate limiting, and email validation
- **Automated Emails**: Resend integration for instant confirmation emails
- **Email Verification (Optional)**: Enable email verification links for double opt-in
- **Persistent Storage**: PostgreSQL database with Drizzle ORM for reliable data storage

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **shadcn/ui** - Beautiful, accessible UI components

### Backend & Database
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database queries
- **Arcjet** - Security & rate limiting
- **Resend** - Transactional email service

### Development Tools
- **Biome** - Fast formatter and linter
- **pnpm** - Fast, disk space efficient package manager

## Architecture & Flow

This is a **headless waitlist system** that collects email addresses from potential users. Here's how it works:

1. **User Submission**: Visitors enter their email on the landing page
2. **Security Check**: Arcjet validates the email, blocks bots, and enforces rate limits
3. **Database Storage**: Valid emails are stored in PostgreSQL with timestamps
4. **Email Confirmation**: Resend sends an immediate welcome email
5. **Local Storage**: Browser remembers submission to prevent duplicates

The system is designed to be **production-ready** with proper error handling, security measures, and scalable architecture. The waitlist component can be easily integrated into any Next.js project or used as a standalone service.

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Docker (for local database)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd waitlist-headless
pnpm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://ashokasec:ashokasec@localhost:5432/waitlist-db"

# Security (Get from https://console.arcjet.com)
ARCJET_KEY="your_arcjet_key"

# Email (Get from https://resend.com)
RESEND_API_KEY="your_resend_api_key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Email Verification (Optional)
# Set to true to require users to verify their email address via a link
EMAIL_VERIFICATION=true

# JWT secret for signing email verification tokens (required if EMAIL_VERIFICATION=true)
# Must be at least 8 characters
JWT_SECRET="your_jwt_secret"
```

### 3. Start Database
```bash
# Using Docker (recommended)
pnpm docker:up

# Or use your own PostgreSQL instance
```

### 4. Setup Database Schema
```bash
pnpm db:push
```

### 5. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your waitlist in action!

## Key Files Explained

- **`components/waitlist-ui.tsx`** - The main waitlist component with form handling
- **`app/api/submit-email/route.ts`** - API endpoint for email processing and (optionally) sending verification emails
- **`app/_db/email-schema.ts`** - Database schema for email storage
- **`lib/emails.ts`** - Email templates for confirmations and verification
- **`lib/seo.ts`** - SEO and branding configuration

### Quick Customization (Search TODO: in code)
Search TODO: in your editor to walk through all setup steps.

![image](https://github.com/user-attachments/assets/3445200f-ecaf-4560-94c6-c3926ccd5e3c)

### Customization Points
1. **Styling**: Modify `components/waitlist-ui.tsx` for custom design
2. **Email Templates**: Edit `lib/emails.ts` for branded emails and verification links
3. **SEO**: Update `lib/seo.ts` with your product details
4. **Database**: Extend `app/_db/email-schema.ts` for additional fields

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Made with ❤️ for the indie hacker community** 
