
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Professor {
    id: string;
    name: string;
    designation: string;
    department: string;
    detailUrl?: string;
    imageUrl?: string;
    email?: string;
    qualifications?: string;
}

async function seed() {
    console.log('Starting seed process...');

    // Read faculty data
    const dataPath = path.join(process.cwd(), 'data', 'faculty.json');
    if (!fs.existsSync(dataPath)) {
        console.error('Data file not found:', dataPath);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const professors: Professor[] = JSON.parse(rawData);

    console.log(`Found ${professors.length} professors to insert.`);

    // Map to snake_case for DB
    const dbData = professors.map(p => ({
        id: p.id,
        name: p.name,
        designation: p.designation,
        department: p.department,
        detail_url: p.detailUrl,
        image_url: p.imageUrl,
        email: p.email,
        qualifications: p.qualifications
    }));

    // Insert in chunks to avoid request size limits
    const chunkSize = 100;
    for (let i = 0; i < dbData.length; i += chunkSize) {
        const chunk = dbData.slice(i, i + chunkSize);
        const { error } = await supabase.from('professors').upsert(chunk);

        if (error) {
            console.error('Error inserting chunk:', error);
        } else {
            console.log(`Inserted rows ${i + 1} to ${Math.min(i + chunkSize, dbData.length)}`);
        }
    }

    console.log('Seeding complete! 🌱');
}

seed();
