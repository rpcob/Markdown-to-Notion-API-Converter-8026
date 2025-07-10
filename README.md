# Markdown to Notion API

A React application that converts Markdown content to Notion API-compatible JSON format.

## Features

- User authentication with JWT
- API key management
- Markdown to Notion JSON conversion
- Interactive test console
- Comprehensive documentation

## Setup Instructions

### Quick Start (Demo Mode)

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```
4. Use the application in demo mode - no backend required!

### Full Setup with Backend

1. Install dependencies:
   ```
   npm install
   ```
2. Start the backend server in one terminal:
   ```
   npm run server
   ```
3. Start the frontend development server in another terminal:
   ```
   npm run dev
   ```

### Setup with Supabase (Alternative Backend)

1. Create a Supabase project at https://supabase.com
2. Create the following tables in Supabase:

   **profiles**
   ```sql
   create table profiles (
     id uuid references auth.users not null primary key,
     name text,
     email text,
     api_key text,
     created_at timestamp with time zone default now()
   );
   
   -- Set up Row Level Security
   alter table profiles enable row level security;
   
   -- Create policies
   create policy "Users can view their own profile" 
     on profiles for select using (auth.uid() = id);
   
   create policy "Users can update their own profile" 
     on profiles for update using (auth.uid() = id);
   ```

   **conversions**
   ```sql
   create table conversions (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references profiles not null,
     input_size integer,
     block_count integer,
     created_at timestamp with time zone default now()
   );
   
   -- Set up Row Level Security
   alter table conversions enable row level security;
   
   -- Create policies
   create policy "Users can view their own conversions" 
     on conversions for select using (auth.uid() = user_id);
   
   create policy "Users can insert their own conversions" 
     on conversions for insert with check (auth.uid() = user_id);
   ```

3. Update the Supabase credentials in `src/lib/supabase.js`

## Demo Mode

This application supports a demo mode that allows you to test the functionality without running the backend server. If the server is not detected, you'll be given the option to continue in demo mode.

## Project Structure

- `/src` - Frontend React application
- `/server` - Backend Express API
- `/public` - Static assets

## Troubleshooting

### CORS Errors
If you encounter CORS errors:
1. Make sure the backend server is running on port 3001
2. Verify the frontend is running on port 5173
3. Check that the CORS configuration in server.js includes your frontend URL

### API Connection Issues
If the API isn't connecting:
1. Check the terminal where you started the server for any errors
2. Verify the API URL in the service files (should be http://localhost:3001/api)
3. If needed, use Demo Mode by clicking "Continue in Demo Mode" on the login page

## Technologies Used

- React + Vite
- Express.js / Supabase
- JWT Authentication
- TailwindCSS
- Framer Motion

## API Documentation

See the `/docs` route in the application for comprehensive API documentation.