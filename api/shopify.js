export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { shop, token, limit = '250', since_id } = req.query;
    if (!shop || !token) {
        return res.status(400).json({ error: 'Paramètres manquants: shop et token requis.' });
    }

    const shopDomain = shop.includes('.') ? shop : `${shop}.myshopify.com`;
    let url = `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&financial_status=paid&limit=${limit}`;
    if (since_id) url += `&since_id=${encodeURIComponent(since_id)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': token,
                'Content-Type': 'application/json'
            }
        });
        const text = await response.text();
        if (!response.ok) {
            return res.status(response.status).json({ error: text });
        }
        res.status(200).json(JSON.parse(text));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
