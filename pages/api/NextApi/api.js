import { callExternalApi } from '@/src/lib/Middleware';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { endpoint, payload, method } = req.body;
      const authHeader = req.headers.authorization || '';
      const accessToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

      if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required' });
      }

      const { data, headers } = await callExternalApi({
        endpoint,
        payload,
        method,
        accessToken
      });

      const contentType = headers['content-type'] || '';
      const isFile =
      contentType.includes('application/vnd.ms-excel') ||
contentType.includes('application/octet-stream') ||
contentType.includes('application/xml') ||
contentType.includes('text/xml') ||
headers['content-disposition']?.includes('attachment');

     if (isFile) {
  res.setHeader('Content-Type', contentType);
  if (headers['content-disposition']) {
    res.setHeader('Content-Disposition', headers['content-disposition']);
  }

  return res.status(200).send(Buffer.from(data)); // 👈 Ensure this is a Buffer
}


      // Default JSON response
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
