import { db } from '@vercel/postgres';

const client = await db.connect();

async function createCountries() {
    await client.sql`
    CREATE TABLE IF NOT EXISTS countries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_eng VARCHAR(100) NOT NULL,
    name_hun VARCHAR(100) NOT NULL,
    is_eu_country boolean NOT NULL
    )
    `;
}

export async function GET() {
    try {
        await client.sql`BEGIN`;
        await createCountries();
        await client.sql`COMMIT`;

        return Response.json({message: 'OPERATION SUCCESSFUL!'});
    } catch(error) {
        await client.sql`ROLLBACK`;
        return Response.json({ error }, { status: 500});
    }
}

