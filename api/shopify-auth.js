export default function handler(req, res) {
    const { shop } = req.query;
    if (!shop) return res.status(400).json({ error: 'Paramètre shop requis' });

    const shopDomain = shop.includes('.') ? shop : `${shop}.myshopify.com`;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: 'SHOPIFY_CLIENT_ID non configuré. Vérifiez les variables d\'environnement Vercel.' });

    const redirectUri = 'https://financehub2-red.vercel.app/api/shopify-callback';
    const scopes = 'read_orders';
    const state = Math.random().toString(36).substring(2, 15);

    const url = `https://${shopDomain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    console.log('OAuth URL:', url);
    console.log('Client ID:', clientId ? clientId.substring(0, 8) + '...' : 'MISSING');
    // Return URL as JSON for debugging — change to redirect after confirming
    return res.status(200).json({ debug_url: url, shop: shopDomain, client_id_present: !!clientId });
}
