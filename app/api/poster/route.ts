export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("token missing", { status: 400 });
  }

  const clientId = process.env.POSTER_CLIENT_ID;
  const clientSecret = process.env.POSTER_CLIENT_SECRET;
  const reloUrl = process.env.RELO_URL;

  if (!clientId || !clientSecret || !reloUrl) {
    return new Response("server configuration missing", { status: 500 });
  }

  const res = await fetch(`https://poster.ooo/api/v1/token/${token}`, {
    headers: {
      "X-POSTER-CLIENT-ID": clientId,
      "X-POSTER-CLIENT-SECRET": clientSecret
    }
  });

  const data = await res.json();
  const uid = data.poster_user_id;

  return Response.redirect(
    `${reloUrl}&uid=${uid}`,
    302
  );
}
