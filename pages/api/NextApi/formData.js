import formidable from 'formidable';
import { callFormApi } from '@/src/lib/FormDataMiddleware';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed, please use POST method.' });
  }

  try {
    // Initialize formidable
    const form = formidable({ multiples: true });

    // Parse the incoming form data
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    // Log the parsed fields and files for debugging
    console.log('Parsed Fields:', fields);
    console.log('Parsed Files:', files);

    // Extract endpoint and method from fields
    const { endpoint, method } = fields;

    // Validate required fields
    if (!endpoint || !method) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Endpoint and method are required.',
      });
    }

    // Create FormData object for callFormApi
    const formData = new FormData();

    // Append all fields (e.g., ClientId, ActionBy) to FormData
    Object.entries(fields).forEach(([key, value]) => {
      if (key !== 'endpoint' && key !== 'method') {
        formData.append(key, value);
      }
    });

    // Append files (e.g., File) to FormData
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file, file.name);
    });

    // Safely extract accessToken from header
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

    // Log the data being sent to callFormApi
    console.log('Calling callFormApi with:', { endpoint, method, formData: Object.fromEntries(formData), accessToken });

    // Call the external API
    const data = await callFormApi({ endpoint, formData, method, accessToken });

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error while calling external API:', error);
    return res.status(500).json({
      error: 'Failed to call external API',
      details: error.message || 'An unknown error occurred while fetching data.',
    });
  }
}