export default async function handler(req, res) {
    const { code, shop } = req.query;
    if (!code || !shop) return res.status(400).send('Paramètres manquants');

    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(500).send('Variables d\'environnement manquantes');

    try {
        const r = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
        });
        const data = await r.json();
        const token = data.access_token;
        if (!token) return res.status(400).send('Token non reçu: ' + JSON.stringify(data));

        // Redirect back to FinanceHub with token in URL fragment (never sent to server)
        const appUrl = `https://financehub2-red.vercel.app/#shopify_shop=${encodeURIComponent(shop)}&shopify_token=${encodeURIComponent(token)}`;
        res.redirect(302, appUrl);
    } catch (err) {
        res.status(500).send('Erreur OAuth: ' + err.message);
    }
}
