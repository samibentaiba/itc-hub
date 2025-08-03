# ITC Hub Authentication Setup

This guide will help you set up authentication for the ITC Hub application using NextAuth.js and Prisma.

## Prerequisites

- Node.js 18+ and Bun
- PostgreSQL database
- All dependencies installed (`bun install`)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/itc_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use any secure random string generator.

## Database Setup

1. **Set up your PostgreSQL database**
2. **Run database migrations:**
   ```bash
   bun run db:migrate
   ```

3. **Seed the database with initial data:**
   ```bash
   bun run db:seed
   ```

## Default Users

After seeding, you'll have these test accounts:

- **Admin User:**
  - Email: `admin@itc.com`
  - Password: `admin123`
  - Role: `ADMIN`

- **Regular User:**
  - Email: `user@itc.com`
  - Password: `user123`
  - Role: `MEMBER`

## Features Implemented

### ✅ Authentication System
- **Login Page** (`/login`) - User authentication with email/password
- **Registration Page** (`/register`) - New user registration
- **Protected Routes** - Middleware protection for all app routes
- **Session Management** - NextAuth.js session handling
- **Password Hashing** - Secure password storage with bcrypt

### ✅ User Management
- **Role-based Access** - ADMIN, SUPER_LEADER, LEADER, MEMBER roles
- **User Profiles** - User information and avatar support
- **Session Integration** - Real user data in the application

### ✅ Security Features
- **Password Validation** - Minimum 6 characters required
- **Email Uniqueness** - Prevents duplicate email registrations
- **Protected API Routes** - Authentication required for sensitive operations
- **Secure Logout** - Proper session cleanup

## Usage

### Starting the Application

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment variables** (see above)

3. **Run database migrations:**
   ```bash
   bun run db:migrate
   ```

4. **Seed the database:**
   ```bash
   bun run db:seed
   ```

5. **Start the development server:**
   ```bash
   bun run dev
   ```

### Testing Authentication

1. **Visit the application** at `http://localhost:3000`
2. **You'll be redirected to login** if not authenticated
3. **Use the test accounts** above to log in
4. **Try registering a new account** at `/register`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Protected Routes
All routes under these paths require authentication:
- `/users/*`
- `/admin/*`
- `/tickets/*`
- `/teams/*`
- `/departments/*`
- `/calendar/*`
- `/protected/*`

## Database Schema

The authentication system uses these main models:

- **User** - User accounts with roles and authentication
- **Department** - Organizational departments
- **Team** - Teams within departments
- **DepartmentMember** - User-department relationships
- **TeamMember** - User-team relationships

## Customization

### Adding New Roles

1. **Update the Role enum** in `prisma/schema.prisma`
2. **Run migration:**
   ```bash
   bun run db:migrate
   ```

### Adding New Authentication Providers

1. **Install provider package**
2. **Add provider to** `src/lib/auth.ts`
3. **Update environment variables**

### Customizing User Fields

1. **Update User model** in `prisma/schema.prisma`
2. **Run migration**
3. **Update registration form** and API

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Authentication Not Working**
   - Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
   - Ensure database is seeded
   - Check browser console for errors

3. **Registration Fails**
   - Check email uniqueness
   - Verify password requirements
   - Check server logs for errors

### Development Commands

```bash
# Database operations
bun run db:generate    # Generate Prisma client
bun run db:push        # Push schema changes
bun run db:migrate     # Run migrations
bun run db:reset       # Reset database
bun run db:seed        # Seed database
bun run db:studio      # Open Prisma Studio

# Development
bun run dev            # Start development server
bun run build          # Build for production
bun run start          # Start production server
bun run lint           # Run ESLint
```

## Security Notes

- **Never commit** `.env` files to version control
- **Use strong passwords** in production
- **Enable HTTPS** in production
- **Regularly update** dependencies
- **Monitor** authentication logs

## Next Steps

With authentication set up, you can now:

1. **Connect real data** to your UI components
2. **Implement role-based features**
3. **Add more authentication providers** (Google, GitHub, etc.)
4. **Set up email verification**
5. **Add password reset functionality**
6. **Implement user profile management**

The authentication system is now fully functional and ready for production use! 