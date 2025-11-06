import db from '../config/database.js';

async function createTables() {
  try {
    console.log('🔄 Creating database tables...');

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        plan VARCHAR(50) DEFAULT 'free',
        subscription_status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        onboarding_completed BOOLEAN DEFAULT false
      )
    `);
    console.log('✅ Table users created successfully');

    // Profiles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        niche VARCHAR(100),
        target_keywords JSONB,
        hourly_rate DECIMAL(10,2),
        public_link VARCHAR(100) UNIQUE,
        portfolio_items JSONB,
        linkedin_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table profiles created');

    // Projects table
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        deadline TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new',
        value DECIMAL(10,2),
        briefing JSONB,
        files JSONB,
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivered_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table projects created');

    // Create indexes for performance
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);
    `);
    console.log('✅ Indexes created');

    console.log('🎉 All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
