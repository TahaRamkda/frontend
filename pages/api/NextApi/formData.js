import formidable from 'formidable';
import FormData from 'form-data'; // ✅ Correct package
import fs from 'fs';
import { callFormApi } from '@/src/lib/FormDataMiddleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed, please use POST method.' });
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

    // ✅ Append all fields to FormData
    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    }

    // ✅ Append all files to FormData using streams
    for (const [key, file] of Object.entries(files)) {
      const f = Array.isArray(file) ? file[0] : file;
      const stream = fs.createReadStream(f.filepath);
      formData.append(key, stream, f.originalFilename);
    }

    // ✅ Log formData (fields only, for debugging)
    console.log("======= Middleware FormData Contents =======");
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'object' && value.path) {
        console.log(`${key}: File ->`, value.path);
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log("============================================");

    const endpoint = fields.endpoint?.toString();
    const method = fields.method?.toString();

    if (!endpoint || !method) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Both endpoint and method are required.',
      });
    }

    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

    // ✅ Send form with fields + files
    const data = await callFormApi({ endpoint, formData, method, accessToken });

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error while calling external API:', error);
    return res.status(500).json({
      error: 'Failed to call external API',
      details: error.message || 'Unknown error',
    });
  }
}
