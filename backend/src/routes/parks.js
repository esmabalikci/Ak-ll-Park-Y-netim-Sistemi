const express = require('express');
const axios = require('axios');

const router = express.Router();

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───────── BASIT IN-MEMORY CACHE ───────── */
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 dakika

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
  // Max 200 girdi tut
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

/* ───────── OVERPASS MİRROR LİSTESİ ───────── */
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

async function postOverpass(overpassQuery) {
  let lastError;

  // Her mirror'ı dene, 429 alırsa bir sonrakine geç
  for (const base of OVERPASS_MIRRORS) {
    // Her mirror için 2 deneme (429'da kısa bekleme)
    for (let retry = 0; retry < 2; retry++) {
      try {
        if (retry > 0) await sleep(3000);

        const response = await axios.post(base, overpassQuery, {
          headers: { 'Content-Type': 'text/plain' },
          timeout: 55000,
          validateStatus: (s) => s < 600,
        });

        if (response.status === 429) {
          console.log(`Overpass 429 rate-limit: ${base} (deneme ${retry + 1})`);
          lastError = new Error(`Overpass HTTP 429 (${base})`);
          continue; // retry aynı mirror veya sonrakine geç
        }

        if (response.status >= 400) {
          lastError = new Error(`Overpass HTTP ${response.status} (${base})`);
          break; // bu mirror'dan vazgeç, sonrakine
        }

        const data = response.data;
        if (!data || typeof data !== 'object') {
          lastError = new Error('Gecersiz Overpass yaniti');
          break;
        }
        if (!Array.isArray(data.elements)) {
          data.elements = [];
        }
        return data;
      } catch (e) {
        lastError = e;
        break; // timeout vs. → sonraki mirror
      }
    }
  }
  throw lastError || new Error('Overpass erisilemedi');
}

async function nominatimSearch(city, district) {
  const lastErrors = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await sleep(2000 * attempt);
      else await sleep(1100);

      const nominatimResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${district}, ${city}, Türkiye`,
          format: 'jsonv2',
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'APAYS-ParkApp/1.0 (ankara.edu.tr; development)',
          Accept: 'application/json',
        },
        timeout: 25000,
        validateStatus: () => true,
      });

      if (nominatimResponse.status === 429) {
        lastErrors.push('Nominatim 429');
        await sleep(3000);
        continue;
      }
      if (nominatimResponse.status >= 400) {
        lastErrors.push(`Nominatim HTTP ${nominatimResponse.status}`);
        continue;
      }

      return nominatimResponse.data;
    } catch (e) {
      lastErrors.push(e.message || 'Nominatim ag hatasi');
    }
  }
  const err = new Error(lastErrors.join('; ') || 'Nominatim basarisiz');
  err.status = 502;
  throw err;
}

function buildAroundQuery(centerLat, centerLon, radiusM) {
  return `
      [out:json][timeout:50];
      (
        node(around:${radiusM},${centerLat},${centerLon})["leisure"="park"];
        way(around:${radiusM},${centerLat},${centerLon})["leisure"="park"];
        relation(around:${radiusM},${centerLat},${centerLon})["leisure"="park"];
        node(around:${radiusM},${centerLat},${centerLon})["tourism"="picnic_site"];
        way(around:${radiusM},${centerLat},${centerLon})["tourism"="picnic_site"];
        relation(around:${radiusM},${centerLat},${centerLon})["tourism"="picnic_site"];
      );
      out center tags;
    `;
}

function buildAreaQuery(areaId) {
  return `
      [out:json][timeout:50];
      area(${areaId})->.districtArea;
      (
        node(area.districtArea)["leisure"="park"];
        way(area.districtArea)["leisure"="park"];
        relation(area.districtArea)["leisure"="park"];
        node(area.districtArea)["tourism"="picnic_site"];
        way(area.districtArea)["tourism"="picnic_site"];
        relation(area.districtArea)["tourism"="picnic_site"];
      );
      out center tags;
    `;
}

function elementsToParks(elements, district, city) {
  if (!Array.isArray(elements)) return [];
  return elements
    .map((item) => {
      const lat = toNumber(item.lat || item.center?.lat);
      const lon = toNumber(item.lon || item.center?.lon);
      if (lat == null || lon == null) {
        return null;
      }

      const activities = [];
      if (item.tags?.playground === 'yes') activities.push('Oyun Alanı');
      if (item.tags?.sport) activities.push('Spor Alanı');
      if (item.tags?.picnic_table === 'yes') activities.push('Piknik');
      if (item.tags?.dog === 'yes') activities.push('Köpek Dostu Alan');
      if (item.tags?.foot === 'yes') activities.push('Yürüyüş');
      if (item.tags?.bicycle === 'yes') activities.push('Bisiklet');

      return {
        id: `${item.type}-${item.id}`,
        name: item.tags?.name || 'İsimsiz Park / Piknik Alanı',
        type: item.tags?.tourism === 'picnic_site' ? 'Piknik Alanı' : 'Park',
        location: `${district}, ${city}`,
        description:
          item.tags?.description || item.tags?.note || 'Açıklama bilgisi bulunmuyor.',
        image:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        capacity: toNumber(item.tags?.capacity),
        occupancyRate: null,
        size_sqm: toNumber(item.tags?.area),
        activities,
        status: 'Bilinmiyor',
        lat,
        lon,
        osmType: item.type,
        osmId: item.id,
      };
    })
    .filter(Boolean);
}

router.get('/', async (req, res) => {
  try {
    const { city, district } = req.query;

    if (!city || !district) {
      return res.status(400).json({
        success: false,
        message: 'city ve district zorunludur.',
      });
    }

    // ── Cache kontrol ──
    const cacheKey = `${city}::${district}`.toLowerCase();
    const cached = getCached(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cacheKey} → ${cached.parks.length} park`);
      return res.json(cached);
    }

    const nominatimData = await nominatimSearch(city, district);
    const place = nominatimData?.[0];

    if (!place?.lat || !place?.lon) {
      const emptyResult = { success: true, count: 0, parks: [] };
      setCache(cacheKey, emptyResult);
      return res.status(404).json(emptyResult);
    }

    const osmId = toNumber(place.osm_id);
    const osmType = place.osm_type;
    let areaId = null;
    if (osmId != null) {
      if (osmType === 'relation') areaId = 3600000000 + osmId;
      if (osmType === 'way') areaId = 2400000000 + osmId;
    }

    const centerLat = Number(place.lat);
    const centerLon = Number(place.lon);
    const fallbackRadius = 18000;

    let elements = [];

    if (areaId) {
      try {
        const areaData = await postOverpass(buildAreaQuery(areaId));
        elements = areaData.elements || [];
      } catch (e) {
        console.warn('Overpass area sorgusu basarisiz:', e.message);
        elements = [];
      }
    }

    let parks = elementsToParks(elements, district, city);

    // Alan sorgusu eleman döndürüp hepsinde merkez/koordinat yoksa elements.length > 0 kalır;
    // bu durumda around yedeği hiç çalışmıyordu — haritada pin kalmıyordu.
    if (parks.length === 0) {
      const aroundData = await postOverpass(
        buildAroundQuery(centerLat, centerLon, fallbackRadius)
      );
      const aroundElements = aroundData.elements || [];
      parks = elementsToParks(aroundElements, district, city);
    }

    const result = {
      success: true,
      count: parks.length,
      parks,
    };

    // ── Sonucu cache'le ──
    setCache(cacheKey, result);
    console.log(`[CACHE SET] ${cacheKey} → ${parks.length} park`);

    return res.json(result);
  } catch (error) {
    console.error('Parks fetch error:', error.message);

    const status = error.status && Number.isInteger(error.status) ? error.status : 500;
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      success: false,
      message:
        'Park verileri alınırken dış servis (OpenStreetMap) hatası oluştu. Bir süre sonra tekrar deneyin.',
      error: error.message,
    });
  }
});

module.exports = router;
