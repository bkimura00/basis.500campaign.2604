export async function GET(request) {
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

  const posterRes = await fetch(`https://poster.ooo/api/v1/token/${encodeURIComponent(token)}`, {
    method: "GET",
    headers: {
      "X-POSTER-CLIENT-ID": clientId,
      "X-POSTER-CLIENT-SECRET": clientSecret
    },
    cache: "no-store"
  });

  if (!posterRes.ok) {
    return new Response(`poster api error: ${posterRes.status}`, { status: 502 });
  }

  const data = await posterRes.json();
  const uid = data?.poster_user_id;

  if (!uid) {
    return new Response("poster_user_id missing", { status: 502 });
  }

  if (String(uid).length > 40) {
    return new Response("poster_user_id exceeds 40 chars", { status: 502 });
  }

  const redirectUrl = new URL(reloUrl);
  redirectUrl.searchParams.set("uid", String(uid));

  return Response.redirect(redirectUrl.toString(), 302);
}
