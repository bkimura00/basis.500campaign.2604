export default async function handler(req, res) {
  const token = req.query.token;

  if (!token) {
    res.status(400).send("token missing");
    return;
  }

  const r = await fetch(`https://poster.ooo/api/v1/token/${token}`, {
    headers: {
      "X-POSTER-CLIENT-ID": process.env.POSTER_CLIENT_ID,
      "X-POSTER-CLIENT-SECRET": process.env.POSTER_CLIENT_SECRET
    }
  });

  const data = await r.json();
  const uid = data.poster_user_id;

  res.writeHead(302, {
    Location: `https://rc-cp.eform.ne.jp/servlet/front?id=1947&p=1&m=1&uid=${uid}`
  });

  res.end();
}
