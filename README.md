# Email Template Manager with Neon PostgreSQL

A Next.js application for managing email templates with persistent storage using Neon PostgreSQL and Drizzle ORM.

## Features

- 🗃️ **Persistent Storage**: Templates are stored in Neon PostgreSQL database
- 🔧 **Modern ORM**: Uses Drizzle ORM for type-safe database operations
- 📝 **Template Management**: Create, read, update, and delete email templates
- 🎨 **Modern UI**: Built with Next.js, Tailwind CSS, and Radix UI
- 🚀 **Serverless**: Powered by Neon's serverless PostgreSQL

## Database Setup

### 1. Create a Neon Account and Database

1. Go to [console.neon.tech](https://console.neon.tech/)
2. Sign up for a free account
3. Create a new project
4. Copy your database connection string

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Get your Neon database URL from https://console.neon.tech/
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

Replace the URL with your actual Neon database connection string.

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate and Run Database Migrations

```bash
# Generate migration files
npm run db:generate

# Push the schema to your database
npm run db:push
```

Alternatively, you can use the studio to inspect your database:

```bash
# Open Drizzle Studio to view your database
npm run db:studio
```

## Database Schema

The application uses a simple schema with one table:

### Templates Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| name | TEXT | Template name (required) |
| content | TEXT | Template content (required) |
| variables | JSON | Template variables object |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## API Endpoints

### Templates

- `GET /api/templates` - Fetch all templates
- `POST /api/templates` - Create a new template
- `GET /api/templates/[id]` - Get a specific template
- `PUT /api/templates/[id]` - Update a specific template
- `DELETE /api/templates/[id]` - Delete a specific template

## Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Management Commands

```bash
# Generate migration files based on schema changes
npm run db:generate

# Push schema changes directly to database (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Open Drizzle Studio for database inspection
npm run db:studio
```

## Production Deployment

1. Set your `DATABASE_URL` environment variable in your deployment platform
2. Run migrations: `npm run db:migrate`
3. Deploy your application

## Technologies Used

- **Frontend**: Next.js 13, React 18, TypeScript
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **UI**: Tailwind CSS, Radix UI
- **Forms**: React Hook Form with Zod validation

## License

MIT License 