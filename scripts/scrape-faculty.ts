import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface Professor {
    id: string;
    name: string;
    designation: string;
    department: string;
    detailUrl?: string;
    imageUrl?: string;
}

// All faculty page URLs with their department names
const FACULTY_PAGES = [
    { url: 'https://www.au.edu.pk/Pages/Faculties/FCAI/Departments/CS/CS_Faculty.aspx', department: 'Computer Science (Morning)' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/FCAI/Departments/CS/CS_EVE_Faculty.aspx', department: 'Computer Science (Evening)' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/FCAI/Departments/CS/CS_IT_Faculty.aspx', department: 'Information Technology' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/FCAI/Departments/CS/CS_BI_Faculty.aspx', department: 'Bioinformatics' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/FCAI/Departments/CT/CT_Faculty.aspx', department: 'Creative Technology' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/FCAI/Departments/CGD/CGD_Faculty.aspx', department: 'Computer Games Development' },
    { url: 'https://au.edu.pk/Pages/Faculties/Engineering/Departments/Electrical/Elec_Faculty.aspx', department: 'Electrical & Computer Engineering' },
    { url: 'https://au.edu.pk/Pages/Faculties/Engineering/Departments/Mechatronics/Mecha_Faculty.aspx', department: 'Mechatronics' },
    { url: 'https://au.edu.pk/Pages/Faculties/Mechatronics_Biomedical_Engineering/Departments/Biomedical/BEME_Faculty.aspx', department: 'Biomedical Engineering' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/NCSA/NCSA_Faculty.aspx', department: 'Cyber Security' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/AUSOM/Department/AUSOM/DBS_Faculty.aspx', department: 'Business Studies' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/AUSOM/Department/AUSOM/DGS_Faculty.aspx', department: 'Graduate Studies' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/AUSOM/Department/AUSOM/DMS_Faculty.aspx', department: 'Management Studies' },
    { url: 'https://au.edu.pk/Pages/Faculties/SocialSciences/Departments/Humanities/Hum_Faculty.aspx', department: 'Humanities & Education' },
    { url: 'https://au.edu.pk/Pages/Faculties/SocialSciences/Departments/Psychlology/Psychology_Faculty.aspx', department: 'Psychology' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/Basic_Applied_Sciences/Departments/Physics/Phy_Faculty.aspx', department: 'Physics' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/Basic_Applied_Sciences/Departments/Mathematics/Math_Faculty.aspx', department: 'Mathematics' },
    { url: 'https://au.edu.pk/Pages/Faculties/Basic_Applied_Sciences/Departments/Statistics/Statistics_faculty.aspx', department: 'Statistics & Data Analysis' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/DASSS/Departments/AerospaceSciences/DASSS_Faculty.aspx', department: 'Aerospace & Strategic Studies' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/IAA/Departments/MechanicalAerospace/Aero_Faculty.aspx', department: 'Mechanical & Aerospace Engineering' },
    { url: 'https://www.au.edu.pk/Pages/Faculties/IAA/Departments/Avionics/Avi_Faculty.aspx', department: 'Avionics Engineering' },
];

async function fetchPage(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.text();
}

function parseFacultyPage(html: string, department: string, baseUrl: string): Professor[] {
    const $ = cheerio.load(html);
    const professors: Professor[] = [];

    // Base URL for the site
    const siteBase = 'https://www.au.edu.pk';

    // Find all faculty cards - they contain both the link and image
    $('a[href*="FacultyDetail.aspx"]').each((_, element) => {
        const link = $(element);
        const href = link.attr('href') || '';

        // Extract faculty ID from URL
        const fidMatch = href.match(/fid=(\d+)/);
        if (!fidMatch) return;

        const fid = fidMatch[1];

        // Check if there's an image inside this link
        const img = link.find('img');
        let imageUrl: string | undefined;

        if (img.length > 0) {
            const imgSrc = img.attr('src');
            if (imgSrc && imgSrc.includes('Faculty_Images')) {
                // Correctly resolve relative path using base URL
                // e.g. ../../../Faculty_Images/153s1.jpg relative to /Pages/Faculties/FCAI/Departments/CS/CS_Faculty.aspx
                try {
                    imageUrl = new URL(imgSrc, baseUrl).href;
                } catch (e) {
                    // Fallback if URL resolution fails
                    const imgPath = imgSrc.replace(/(\.\.\/)+/g, '').replace(/^\/+/, '');
                    imageUrl = `${siteBase}/${imgPath}`;
                }
            }
        }

        // Get text content (name and designation)
        const text = link.text().trim();

        // Parse name and designation from text
        const { name, designation } = parseNameAndDesignation(text);

        if (name) {
            professors.push({
                id: `au-${fid}`,
                name: name,
                designation: designation || 'Faculty Member',
                department: department,
                detailUrl: new URL(href, baseUrl).href,
                imageUrl: imageUrl,
            });
        }
    });

    // Remove duplicates (same fid)
    const unique = professors.filter((prof, index, self) =>
        index === self.findIndex((p) => p.id === prof.id)
    );

    return unique;
}


function parseNameAndDesignation(text: string): { name: string; designation: string } {
    // Common designation patterns - order matters (longer patterns first)
    const designationPatterns = [
        { pattern: /Tenured Associate Professor$/i, designation: 'Associate Professor (Tenured)' },
        { pattern: /Tenured Professor$/i, designation: 'Professor (Tenured)' },
        { pattern: /Chair Department$/i, designation: 'Chair Department' },
        { pattern: /Associate Professor$/i, designation: 'Associate Professor' },
        { pattern: /Assistant Professor$/i, designation: 'Assistant Professor' },
        { pattern: /Senior Lecturer$/i, designation: 'Senior Lecturer' },
        { pattern: /Lab Engineer$/i, designation: 'Lab Engineer' },
        { pattern: /Research Associate$/i, designation: 'Research Associate' },
        { pattern: /Teaching Assistant$/i, designation: 'Teaching Assistant' },
        { pattern: /Visiting Faculty$/i, designation: 'Visiting Faculty' },
        { pattern: /Lecturer$/i, designation: 'Lecturer' },
        { pattern: /Professor$/i, designation: 'Professor' },
    ];

    let name = text;
    let designation = '';

    // Try to find designation pattern at the end of the string
    for (const { pattern, designation: desig } of designationPatterns) {
        const match = text.match(pattern);
        if (match) {
            const idx = match.index!;
            name = text.substring(0, idx).trim();
            designation = desig;
            break;
        }
    }

    // Clean up name - remove extra spaces
    name = name.replace(/\s+/g, ' ').trim();

    // Handle truncated names like "Dr. Ashfaq Hussain Fa.."
    if (name.endsWith('..')) {
        name = name.slice(0, -2).trim();
    }

    // Remove trailing dots
    name = name.replace(/\.+$/, '').trim();

    // Remove text in parentheses like "(On Study Leave)" or "(On Lea.." from name
    // but keep (Progr.. or similar prefixes
    name = name.replace(/\s*\(On.*$/i, '').trim();

    return { name, designation };
}

async function scrapeAllFaculty(): Promise<Professor[]> {
    const allProfessors: Professor[] = [];

    console.log('Starting faculty scrape from Air University...\n');

    for (const page of FACULTY_PAGES) {
        try {
            console.log(`Scraping: ${page.department}...`);
            const html = await fetchPage(page.url);
            const professors = parseFacultyPage(html, page.department, page.url);
            console.log(`  Found ${professors.length} faculty members`);
            allProfessors.push(...professors);

            // Small delay to be nice to the server
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`  Error scraping ${page.department}:`, error);
        }
    }

    console.log(`\nTotal faculty scraped: ${allProfessors.length}`);
    return allProfessors;
}

async function main() {
    try {
        const professors = await scrapeAllFaculty();

        // Save to JSON file
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const outputPath = path.join(dataDir, 'faculty.json');
        fs.writeFileSync(outputPath, JSON.stringify(professors, null, 2));
        console.log(`\nSaved to: ${outputPath}`);

        // Also generate TypeScript data file
        const tsContent = `// Auto-generated faculty data from Air University website
// Generated on: ${new Date().toISOString()}

import { Professor } from './types';

export const scrapedProfessors: Professor[] = ${JSON.stringify(professors, null, 2)};
`;

        const tsOutputPath = path.join(process.cwd(), 'src', 'lib', 'faculty-data.ts');
        fs.writeFileSync(tsOutputPath, tsContent);
        console.log(`Generated TypeScript file: ${tsOutputPath}`);

    } catch (error) {
        console.error('Scraping failed:', error);
        process.exit(1);
    }
}

main();
