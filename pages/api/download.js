import https from "https";
import { BASE_URL } from "@/utils/apiConstants";
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing media URL" });
  }

  const decodedUrl = decodeURIComponent(url);

  // Security: Only allow specific domains (optional but recommended)
  if (!decodedUrl.startsWith(`${BASE_URL}`)) {
    return res.status(403).json({ error: "Forbidden media URL" });
  }

  https.get(decodedUrl, (fileRes) => {
    const contentType = fileRes.headers["content-type"] || "application/octet-stream";
    const fileName = decodedUrl.split("/").pop();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    fileRes.pipe(res);
  }).on("error", (err) => {
    res.status(500).json({ error: "Failed to fetch file", details: err.message });
  });
}
