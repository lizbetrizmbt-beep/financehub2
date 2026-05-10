export default function handler(req, res) {
    const { shop } = req.query;
    if (!shop) return res.status(400).json({ error: 'Paramètre shop requis' });

    const shopDomain = shop.includes('.') ? shop : `${shop}.myshopify.com`;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: 'SHOPIFY_CLIENT_ID non configuré' });

    const redirectUri = 'https://financehub2-red.vercel.app/api/shopify-callback';
    const scopes = 'read_orders';
    const state = Buffer.from(Date.now().toString()).toString('base64');

    const url = `https://${shopDomain}/admin/oauth/authorize?client_id=${encodeURIComponent(clientId)}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    res.redirect(302, url);
}
