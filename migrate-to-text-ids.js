const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    console.log('Starting migration...');
    
    // 1. Drop foreign key constraints
    console.log('Dropping foreign key constraints...');
    await client.query('ALTER TABLE session DROP CONSTRAINT IF EXISTS session_user_id_user_id_fk');
    await client.query('ALTER TABLE account DROP CONSTRAINT IF EXISTS account_user_id_user_id_fk');
    console.log('✓ Foreign keys dropped');
    
    // 2. Convert user.id from integer to text
    console.log('Converting user.id to text...');
    await client.query('ALTER TABLE "user" ALTER COLUMN id TYPE text USING id::text');
    console.log('✓ user.id converted to text');
    
    // 3. Convert session.user_id from integer to text
    console.log('Converting session.user_id to text...');
    await client.query('ALTER TABLE session ALTER COLUMN user_id TYPE text USING user_id::text');
    console.log('✓ session.user_id converted to text');
    
    // 4. Convert account.user_id from integer to text
    console.log('Converting account.user_id to text...');
    await client.query('ALTER TABLE account ALTER COLUMN user_id TYPE text USING user_id::text');
    console.log('✓ account.user_id converted to text');
    
    // 5. Convert account.id from integer to text (if needed)
    console.log('Converting account.id to text...');
    await client.query('ALTER TABLE account ALTER COLUMN id TYPE text USING id::text');
    console.log('✓ account.id converted to text');
    
    // 6. Convert session.id from integer to text (if needed)
    console.log('Converting session.id to text...');
    await client.query('ALTER TABLE session ALTER COLUMN id TYPE text USING id::text');
    console.log('✓ session.id converted to text');
    
    console.log('✓ Migration complete! Run "npm run db:push" next.');
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
