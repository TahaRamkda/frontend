import { callExternalApi } from '@/src/lib/Middleware';

export default async function handler(req, res) {
  
  if (req.method === 'POST') {
    try {
      const { endpoint , payload , method } = req.body; // Extract endpoint from the request body

      if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required' });
      }

      // Call the external API with the endpoint
      const data = await callExternalApi({ endpoint , payload , method });

      // Return the response data back to the frontend
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
