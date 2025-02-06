import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request received at /api/proxy", req.url); // Log the incoming request URL
  try {
    // Ensure `req.url` is correctly set
    if (!req.url) {
      return res.status(400).json({ error: "Invalid request URL" });
    }

    // Remove "/api/proxy" from request URL
    const backendUrl = `http://mrkuru-api-server.us-east-1.elasticbeanstalk.com${req.url.replace(
      "/api/proxy",
      ""
    )}`;

    console.log("Proxying request to:", backendUrl);

    // Filter headers to remove restricted ones
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (key.toLowerCase() !== "host" && value) {
        headers.append(key, Array.isArray(value) ? value.join(", ") : value);
      }
    });

    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Send response back to frontend
    res.status(response.status).json(await response.json());
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
