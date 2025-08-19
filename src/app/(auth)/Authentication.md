# Authentication System Setup Guide

This guide will help you set up the complete authentication system with the new structure.

## File Structure

The authentication pages now follow this consistent structure:

```
src/app/(auth)/
├── forget-password/
│   ├── client.tsx     # Client-side component
│   ├── hook.ts        # Custom React hook
│   ├── loading.tsx    # Loading component
│   ├── page.tsx       # Server-side page wrapper
│   └── types.ts       # TypeScript types
├── login/
│   ├── client.tsx
│   ├── hook.ts
│   ├── loading.tsx
│   ├── page.tsx
│   └── types.ts
├── register/
│   ├── client.tsx
│   ├── hook.ts
│   ├── loading.tsx
│   ├── page.tsx
│   └── types.ts
└── reset-password/
    └── [token]/
        ├── client.tsx
        ├── hook.ts
        ├── loading.tsx
        ├── page.tsx
        └── types.ts
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install nodemailer @types/nodemailer
# or
yarn add nodemailer @types/nodemailer
```

### 2. Environment Configuration

Copy the `.env.example` file to `.env.local` and configure the following:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-very-secure-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (for password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="ITC Hub <noreply@itchub.com>"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Email Setup (Gmail Example)

To use Gmail for sending reset emails:

1. Enable 2-factor authentication on your Google account
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### 4. Database Setup

Run the database migrations and seed:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Component Dependencies

Make sure you have these UI components installed:

```bash
# If using shadcn/ui
npx shadcn@latest add card button input label separator checkbox
```

## Features Implemented

### ✅ Login System

- Email/password authentication
- Password visibility toggle
- Form validation
- Loading states
- Error handling
- Google OAuth integration
- Session management

### ✅ Registration System

- User registration with email/password
- Password confirmation
- Terms and conditions checkbox
- Email validation
- Duplicate email detection
- Success feedback

### ✅ Forget Password System

- Email-based password reset
- Secure token generation
- Email sending with HTML templates
- Resend functionality
- User feedback

### ✅ Reset Password System

- Token validation
- Secure password reset
- Password confirmation
- Token expiry handling
- Success confirmation

## API Routes

The following API routes are implemented:

- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/validate-reset-token` - Validate reset token
- `POST /api/auth/reset-password` - Reset user password

## Security Features

1. **Password Hashing**: Uses bcryptjs with salt rounds of 12
2. **Token Security**: Cryptographically secure random tokens
3. **Token Expiry**: Reset tokens expire after 1 hour
4. **Email Enumeration Protection**: Always returns success message
5. **Input Validation**: Server-side validation for all inputs
6. **CSRF Protection**: Built into NextAuth.js

## Usage Examples

### Using the Login Hook

```typescript
import { useLogin } from './hook';

function LoginForm() {
  const {
    formData,
    state,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    handleGoogleSignIn
  } = useLogin();

  // Use the hook's methods and state
  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
}
```

### Server-Side Authentication Check

```typescript
import { getAuthenticatedUser } from '@/lib/auth-helpers';

export default async function ProtectedPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome {user.user.email}!</div>;
}
```

## Customization

### Email Templates

Edit the HTML template in `/api/auth/forgot-password/route.ts` to match your brand.

### Styling

All components use Tailwind CSS and can be customized by modifying the className properties.

### Validation Rules

Update validation logic in the respective hook files:

- Password minimum length
- Email format requirements
- Additional field validations

## Troubleshooting

### Common Issues

1. **Email not sending**: Check your email credentials and app password
2. **Database errors**: Ensure Prisma schema is up to date
3. **Token validation fails**: Check token expiry and database cleanup
4. **Session issues**: Verify NEXTAUTH_SECRET is set correctly

### Debug Mode

Enable debug logging in NextAuth:

```javascript
// In your auth configuration
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  // ... other options
}
```

## Testing Accounts

After running the seed, you can test with:

- **Admin**: `sami.bentaiba@example.com` / `password123`
- **Manager**: `jane.doe@example.com` / `password123`
- **User**: `john.smith@example.com` / `password123`

## Next Steps

1. Set up email verification for new users
2. Implement social login (Google, GitHub, etc.)
3. Add rate limiting for auth endpoints
4. Set up monitoring and logging
5. Configure production email service (SendGrid, AWS SES, etc.)

## Support

If you encounter any issues, check:

1. Environment variables are correctly set
2. Database is properly seeded
3. Email service is configured
4. All dependencies are installed

The authentication system is now fully functional with proper error handling, validation, and user feedback!
