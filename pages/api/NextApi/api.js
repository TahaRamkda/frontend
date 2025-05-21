import { callExternalApi } from '@/src/lib/Middleware';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { endpoint, payload, method } = req.body;

      // Safely extract accessToken from header, or set to empty string
      const authHeader = req.headers.authorization || '';
      const accessToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

      if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required' });
      }

      const data = await callExternalApi({ endpoint, payload, method, accessToken });

      return res.status(200).json({ data });
    } catch (error) {
      console.error('Error while calling external API:', error);
      return res.status(500).json({
        error: 'Failed to call external API',
        details: error.message || 'An unknown error occurred while fetching data.',
      });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed, please use POST method.' });
  }
}
