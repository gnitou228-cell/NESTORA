const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres.nqouspwizrkasuyelghv:93422713Well1@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
  
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Create bucket if not exists
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('property-images', 'property-images', true) 
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log("Bucket 'property-images' ensured and set to public.");

    // Note: To allow public uploads, we need RLS policies on storage.objects.
    // Let's create an INSERT policy allowing anyone to upload (or only authenticated users if we can).
    // Actually, since we're handling images from frontend via Supabase JS auth, auth.role() = 'authenticated' works.
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'storage'
              AND tablename = 'objects'
              AND policyname = 'Public Access property-images'
        ) THEN
            CREATE POLICY "Public Access property-images"
            ON storage.objects FOR SELECT
            USING ( bucket_id = 'property-images' );
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'storage'
              AND tablename = 'objects'
              AND policyname = 'Authenticated uploads property-images'
        ) THEN
            CREATE POLICY "Authenticated uploads property-images"
            ON storage.objects FOR INSERT
            WITH CHECK ( bucket_id = 'property-images' AND auth.role() = 'authenticated' );
        END IF;
      END
      $$;
    `);
    
    console.log("Storage policies for 'property-images' created.");
  } catch (err) {
    console.error("Error setting up storage:", err);
  } finally {
    await client.end();
  }
}

main();
