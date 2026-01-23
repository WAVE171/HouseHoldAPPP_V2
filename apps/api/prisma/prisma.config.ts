import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),

  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');

      const connectionString =
        process.env.DATABASE_URL ||
        'postgresql://household:household_secret@localhost:5432/household_db?schema=public';

      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});
