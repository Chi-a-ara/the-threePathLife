import { Request } from "express";

/**
 * Extract real IP address from request, considering proxies
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers["x-real-ip"];
  if (typeof realIP === "string") {
    return realIP;
  }
  return req.socket.remoteAddress || "unknown";
}

/**
 * Get geolocation data from IP address using ipapi.co (free tier: 1000 requests/day)
 * For production, consider upgrading or using ipinfo.io, maxmind, or similar services
 */
export async function getGeolocationFromIP(ip: string): Promise<{
  country: string | null;
  city: string | null;
  countryCode: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
}> {
  // Skip geolocation for localhost/private IPs
  if (
    ip === "unknown" ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return {
      country: null,
      city: null,
      countryCode: null,
      region: null,
      latitude: null,
      longitude: null,
    };
  }

  try {
    // Using ipapi.co free tier (no API key needed for basic usage)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        "User-Agent": "Destiny Matrix OSINT Platform",
      },
    });

    if (!response.ok) {
      console.warn(`[Geolocation] Failed to fetch data for IP ${ip}: ${response.status}`);
      return {
        country: null,
        city: null,
        countryCode: null,
        region: null,
        latitude: null,
        longitude: null,
      };
    }

    const data = await response.json();

    return {
      country: data.country_name || null,
      city: data.city || null,
      countryCode: data.country_code || null,
      region: data.region || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };
  } catch (error) {
    console.error(`[Geolocation] Error fetching data for IP ${ip}:`, error);
    return {
      country: null,
      city: null,
      countryCode: null,
      region: null,
      latitude: null,
      longitude: null,
    };
  }
}

/**
 * Get user agent information
 */
export function getUserAgent(req: Request): string {
  return req.headers["user-agent"] || "unknown";
}

/**
 * Collect full OSINT data from request
 */
export async function collectOSINTData(req: Request) {
  const ip = getClientIP(req);
  const userAgent = getUserAgent(req);
  const geo = await getGeolocationFromIP(ip);

  return {
    ipAddress: ip,
    userAgent,
    country: geo.country,
    city: geo.city,
    countryCode: geo.countryCode,
    region: geo.region,
    latitude: geo.latitude,
    longitude: geo.longitude,
  };
}
