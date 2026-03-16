import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the root
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin@homecare.com';
  const password = 'adminpassword123';
  
  console.log(`Attempting to create admin user: ${email}`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: 'Super Admin',
      is_admin: true
    }
  });

  if (error) {
    console.error("Failed to create admin:", error.message);
  } else {
    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("\nYou can now log in using these credentials on your local site.");
  }
}

createAdmin();
