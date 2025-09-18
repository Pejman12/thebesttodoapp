# Next.js example todo app with Clerk, Drizzle ORM, NeonDB, and OpenNext

The perfect example of a Next.js full stack application, built with the following technologies:

- [Next.js](https://nextjs.org/) - The React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any
- [Jolly-ui](https://jolly-ui.com/) - A component library for building beautiful and accessible user
- [Drizzle ORM](https://orm.drizzle.team/) - A Type-safe ORM for SQL databases
- [NeonDB](https://neondb.com/) - Serverless Postgres database
- [Clerk](https://clerk.com/) - User management and authentication
  interfaces
- [Opennext](https://opennext.dev/) - Open source Next.js build and deployment tool
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs made easy

You can find the live demo on [thebesttodoapp.com](https://thebesttodoapp.com/).

## Getting Started

### Installation

1. Install dependencies
   ```sh
   bun install
   ```
2. Create a `.env` file in the root of your project and add the following environment variables:
   ```
    NEXTJS_ENV=development
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require"
    CLERK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    NEXT_PUBLIC_BUCKET_URL=https://...
   ```
3. Generate the database schema
   ```sh
   bun run db:generate
   ```
4. Run migrations to create the database schema
   ```sh
   bun run db:migrate
   ```
5. Push the database schema to NeonDB
   ```sh
   bun run db:push
   ```
6. Run the development server
   ```sh
   bun run dev
   ```

## Deployment

This project is deployed using [OpenNext](https://opennext.dev/)
to [Cloudflare Workers](https://workers.cloudflare.com/).

To deploy your own instance, you will need to have
the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) installed and
configured.

1. Build the project for production
   ```sh
   bun run build:prod
   ```
2. Deploy to Cloudflare
   ```sh
   bun run deploy:prod
   ```

## Features

- User authentication with Clerk
- Create, read, update, and delete todos
- Full-stack application with a Next.js frontend and a tRPC backend
- Type-safe database queries with Drizzle ORM
- Serverless Postgres database with NeonDB
- Deployment to Cloudflare Workers with OpenNext

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and
create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull
request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git switch -c feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
