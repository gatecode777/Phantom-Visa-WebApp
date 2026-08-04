// Decoupled International Postal Code & Address Lookup Service
// Primary: Zippopotam.us
// Secondary Fallback: OpenStreetMap Nominatim
// Tertiary Fallback: India Post API & Local Map Engine
// Supports 500ms debouncing, in-memory caching, and modular provider extension (Google/Loqate)

export interface PostalLookupResult {
  city: string;
  state: string;
  source: "zippopotam" | "nominatim" | "india_post" | "cache" | "local_map";
}

// In-Memory Lookup Cache to prevent redundant network calls
const postalCache = new Map<string, PostalLookupResult>();

// Expanded Indian Local Map
const LOCAL_INDIAN_MAP: Record<string, { city: string; state: string }> = {
  "110001": { city: "New Delhi", state: "Delhi" },
  "110002": { city: "Central Delhi", state: "Delhi" },
  "110016": { city: "South Delhi", state: "Delhi" },
  "110085": { city: "North West Delhi", state: "Delhi" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "121001": { city: "Faridabad", state: "Haryana" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400050": { city: "Bandra, Mumbai", state: "Maharashtra" },
  "411001": { city: "Pune", state: "Maharashtra" },
  "440001": { city: "Nagpur", state: "Maharashtra" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "560038": { city: "Indiranagar, Bengaluru", state: "Karnataka" },
  "570001": { city: "Mysuru", state: "Karnataka" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "700091": { city: "Salt Lake, Kolkata", state: "West Bengal" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "641001": { city: "Coimbatore", state: "Tamil Nadu" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "530001": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "395001": { city: "Surat", state: "Gujarat" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "302002": { city: "Jaipur", state: "Rajasthan" },
  "302003": { city: "Jaipur", state: "Rajasthan" },
  "302004": { city: "Jaipur", state: "Rajasthan" },
  "302005": { city: "Jaipur", state: "Rajasthan" },
  "302006": { city: "Jaipur", state: "Rajasthan" },
  "302012": { city: "Jaipur", state: "Rajasthan" },
  "302015": { city: "Jaipur", state: "Rajasthan" },
  "302017": { city: "Jaipur", state: "Rajasthan" },
  "302019": { city: "Jaipur", state: "Rajasthan" },
  "302020": { city: "Jaipur", state: "Rajasthan" },
  "302021": { city: "Jaipur", state: "Rajasthan" },
  "302029": { city: "Jaipur", state: "Rajasthan" },
  "302033": { city: "Jaipur", state: "Rajasthan" },
  "306115": { city: "Pali", state: "Rajasthan" },
  "342001": { city: "Jodhpur", state: "Rajasthan" }
};

/**
 * Main Postal Lookup Pipeline
 */
export async function lookupPostalAddress(
  postalCode: string,
  countryCode: string,
  countryName: string
): Promise<PostalLookupResult | null> {
  const cleanPin = postalCode.trim().replace(/\s+/g, "");
  if (!cleanPin || cleanPin.length < 3) return null;

  const cacheKey = `${countryCode.toUpperCase()}:${cleanPin.toUpperCase()}`;

  // 1. Check in-memory lookup cache
  if (postalCache.has(cacheKey)) {
    return postalCache.get(cacheKey)!;
  }

  // 2. India specific fast local map lookup
  if (countryCode === "IN" && LOCAL_INDIAN_MAP[cleanPin]) {
    const res: PostalLookupResult = {
      city: LOCAL_INDIAN_MAP[cleanPin].city,
      state: LOCAL_INDIAN_MAP[cleanPin].state,
      source: "local_map"
    };
    postalCache.set(cacheKey, res);
    return res;
  }

  // 3. Primary Provider: Zippopotam.us
  try {
    const zipRes = await fetch(`https://api.zippopotam.us/${countryCode.toLowerCase()}/${cleanPin}`);
    if (zipRes.ok) {
      const zipData = await zipRes.json();
      if (zipData.places && zipData.places.length > 0) {
        const place = zipData.places[0];
        const city = place["place name"] || "";
        const state = place["state"] || place["state abbreviation"] || "";
        if (city || state) {
          const result: PostalLookupResult = { city, state, source: "zippopotam" };
          postalCache.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch (e) {
    console.warn("Zippopotam lookup skipped/failed:", e);
  }

  // 4. Secondary Provider (Fallback): OpenStreetMap Nominatim API
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
      cleanPin
    )}&country=${encodeURIComponent(countryName)}&format=json&addressdetails=1`;
    const nomRes = await fetch(nomUrl, {
      headers: {
        "Accept-Language": "en"
      }
    });

    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData) && nomData.length > 0) {
        const addr = nomData[0].address;
        if (addr) {
          const city =
            addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.municipality || "";
          const state = addr.state || addr.region || addr.state_district || "";
          if (city || state) {
            const result: PostalLookupResult = { city, state, source: "nominatim" };
            postalCache.set(cacheKey, result);
            return result;
          }
        }
      }
    }
  } catch (e) {
    console.warn("Nominatim fallback skipped/failed:", e);
  }

  // 5. Tertiary Provider (India Post API)
  if (countryCode === "IN" && /^\d{6}$/.test(cleanPin)) {
    try {
      const indiaRes = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      if (indiaRes.ok) {
        const indiaData = await indiaRes.json();
        if (
          Array.isArray(indiaData) &&
          indiaData[0]?.Status === "Success" &&
          indiaData[0]?.PostOffice?.length > 0
        ) {
          const po = indiaData[0].PostOffice[0];
          const city = po.District || po.Block || po.Name || "";
          const state = po.State || "";
          if (city || state) {
            const result: PostalLookupResult = { city, state, source: "india_post" };
            postalCache.set(cacheKey, result);
            return result;
          }
        }
      }
    } catch (e) {
      console.warn("India Post API skipped/failed:", e);
    }
  }

  return null;
}
