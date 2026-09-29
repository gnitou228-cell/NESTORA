const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres.nqouspwizrkasuyelghv:93422713Well1@aws-1-eu-west-1.pooler.supabase.com:5432/postgres' });
  await client.connect();
  
  try {
    const resProfiles = await client.query('SELECT * FROM profiles');
    console.log('profiles table:', resProfiles.rows);
  } catch(e) {
    console.log('No profiles table', e.message);
  }

  try {
    const resUsers = await client.query('SELECT * FROM "User"');
    console.log('User table:', resUsers.rows);
  } catch(e) {
    console.log('No User table', e.message);
  }

  await client.end();
}

run();
