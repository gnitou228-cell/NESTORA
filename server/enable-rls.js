const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres.nqouspwizrkasuyelghv:93422713Well1@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Retrieve all tables in the public schema
    const res = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);

    const tables = res.rows.map(row => row.tablename);
    console.log("Found tables:", tables.join(', '));

    for (const table of tables) {
      if (table !== '_prisma_migrations') {
        // Enable RLS
        await client.query(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY;`);
        console.log(`Enabled RLS on public."${table}"`);
      }
    }

    console.log("RLS successfully enabled on all Prisma tables.");
    
  } catch (err) {
    console.error("Error enabling RLS:", err);
  } finally {
    await client.end();
  }
}

main();
