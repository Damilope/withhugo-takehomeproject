## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

When running tests, make sure to start the server first and have an `.env` file after the `example-env-file`.

This app uses [https://www.prisma.io/](prisma) so make sure to run `npx prisma generate` when contributing, and `npx prisma migrate dev --name update-schema` (you can use any name besides `update-schema`) before your first run, and on updating the schema.
