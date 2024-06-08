export function POST(
  request: Request,
  { params }: { params: { test: string } }
) {
  return new Response("Hello, Next.js!");
}
