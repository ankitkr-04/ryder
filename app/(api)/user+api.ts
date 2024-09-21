import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const res = await sql`
  INSERT INTO users (name, email, clerk_id)
    VALUES (${name}, ${email}, ${clerkId})
  `;

    return new Response(JSON.stringify({ data: res }), { status: 201 });
  } catch (error: any) {
    console.error(error);

    return Response.json({ error: error }, { status: 500 });
  }
}
