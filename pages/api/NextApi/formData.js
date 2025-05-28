import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import { callFormApi } from '@/src/lib/FormDataMiddleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Please use the POST method.',
    });
  }

  try {
    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const formData = new FormData();

    // Handle form fields
    for (const [key, value] of Object.entries(fields)) {
      const val = Array.isArray(value) ? value[0] : value;
      formData.append(key, val);
    }

    // Handle file uploads (single file per field)
    for (const [key, file] of Object.entries(files)) {
      const f = Array.isArray(file) ? file[0] : file;
      const stream = fs.createReadStream(f.filepath);
      formData.append(key, stream, f.originalFilename);
    }

    const endpoint = fields.endpoint?.toString();
    const method = fields.method?.toString();

    if (!endpoint || !method) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Both "endpoint" and "method" are required.',
      });
    }

    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : '';

    // Call external API
    const data = await callFormApi({
      endpoint,
      method,
      formData,
      accessToken,
    });

    // Parse response (if it's a string)
    let parsed;
    try {
      parsed = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      return res.status(502).json({
        error: 'Invalid response from external API',
        rawResponse: data,
      });
    }

    return res.status(200).json(parsed?.result || parsed);

  } catch (error) {
    console.error('Error while calling external API:', error);
    return res.status(500).json({
      error: 'Failed to call external API',
      details: error.message || 'Unknown error',
    });
  }
}
