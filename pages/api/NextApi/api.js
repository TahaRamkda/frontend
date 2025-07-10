import { callExternalApi } from "@/src/lib/Middleware";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { endpoint, payload, method } = req.body;
      const authHeader = req.headers.authorization || "";
      const accessToken = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : "";

      if (!endpoint) {
        return res.status(400).json({ error: "Endpoint is required" });
      }

      const { data, headers } = await callExternalApi({
        endpoint,
        payload,
        method,
        accessToken,
      });

      const contentType = headers["content-type"] || "";
      const isFile =
        contentType.includes("application/vnd.ms-excel") ||
        contentType.includes("application/octet-stream") ||
        contentType.includes("application/xml") ||
        contentType.includes("text/xml") ||
        headers["content-disposition"]?.includes("attachment");
      if (isFile) {
        res.setHeader("Content-Type", contentType);
        if (headers["content-disposition"]) {
          res.setHeader("Content-Disposition", headers["content-disposition"]);
        }
        return res.status(200).end(data); // ✅ correctly returns raw file
      }
      const utf8String = Buffer.from(data).toString("utf-8");

      // Try to parse JSON, fallback to plain text
      try {
        const parsed = JSON.parse(utf8String);
        return res.status(200).json(parsed.result || parsed);
      } catch (err) {
        // It's not JSON; return plain text
        return res.status(200).send(utf8String);
      }
      // Default JSON response
      // return res.status(200).json(data.result);
    } catch (error) {
      console.error("Error while calling external API:", error);

      let statusCode = 500;
      let details = error.message;
      let title = "Failed to call external API";
      console.error("Error Your Message:", error.message);
      try {
        const parsed = JSON.parse(error.message);
        statusCode = parsed.status || 500;
        details = parsed;
        title = parsed.title || title;
         console.error("Er Message:", parsed);
      } catch {}

      return res.status(statusCode).json({
        error: title,
        details,
      });
    }
  } else {
    return res
      .status(405)
      .json({ error: "Method Not Allowed, please use POST method." });
  }
}
