import { GeolocationCoordinates } from '@/modules/staffs/attendance/attendance.types'

// Helper: Haversine distance (meters)
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // meters
  const toRadians = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export type ForwardGeocodeResult = {
  latitude: number
  longitude: number
  displayName?: string
  osmType?: string
  osmClass?: string
  type?: string
  boundingbox?: [string, string, string, string] // lat_min, lat_max, lon_min, lon_max
  granularity: 'exact' | 'street' | 'neighbourhood' | 'city' | 'region' | 'country' | 'unknown'
  estimatedRadiusMeters?: number // derived from boundingbox if available
  importance?: number
  raw?: any
}

// Map Mapbox place_type to granularity
function detectMapboxGranularity(place_type: string[]): ForwardGeocodeResult['granularity'] {
  if (!place_type || place_type.length === 0) return 'unknown'
  const type = place_type[0]
  switch (type) {
    case 'address':
    case 'poi':
      return 'exact'
    case 'street':
      return 'street'
    case 'neighborhood':
      return 'neighbourhood'
    case 'place':
      return 'city'
    case 'region':
      return 'region'
    case 'country':
      return 'country'
    default:
      return 'unknown'
  }
}

// Helper: determine granularity from nominatim result.type/class
function detectGranularity(t?: string, c?: string): ForwardGeocodeResult['granularity'] {
  let gran: ForwardGeocodeResult['granularity'] = 'unknown'
  const exactTypes = new Set(['house', 'building', 'residential', 'yes', 'commercial', 'apartments'])
  const streetTypes = new Set(['street', 'road', 'pedestrian'])
  const neighbourhoodTypes = new Set(['neighbourhood', 'suburb', 'quarter'])
  const cityTypes = new Set(['city', 'town', 'village', 'municipality'])
  const regionTypes = new Set(['state', 'region', 'province', 'county'])
  const countryTypes = new Set(['country'])

  if (t && exactTypes.has(t)) gran = 'exact'
  else if (t && streetTypes.has(t)) gran = 'street'
  else if (t && neighbourhoodTypes.has(t)) gran = 'neighbourhood'
  else if (t && cityTypes.has(t)) gran = 'city'
  else if (t && regionTypes.has(t)) gran = 'region'
  else if (t && countryTypes.has(t)) gran = 'country'
  else if (c && c === 'place' && t === 'house') gran = 'exact'

  return gran
}

// Forward geocoding with Mapbox API
export async function getCoordinatesFromMapbox(locationText: string): Promise<ForwardGeocodeResult | null> {
  try {
    if (!locationText || locationText.trim() === '') return null

    const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY || 'YOUR_MAPBOX_API_KEY'
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      locationText
    )}.json?access_token=${MAPBOX_API_KEY}&limit=5&autocomplete=false`

    const res = await fetch(url)
    if (!res.ok) {
      console.error({ event: 'mapbox_geocode_error', status: res.status, statusText: res.statusText })
      throw new Error('LOCATION_SERVICE_ERROR')
    }

    const data = await res.json()
    if (!data.features || data.features.length === 0) return null

    // Map Mapbox feature to ForwardGeocodeResult
    const enriched: ForwardGeocodeResult[] = data.features.map((feature: any): ForwardGeocodeResult => {
      const [longitude, latitude] = feature.center
      const granularity = detectMapboxGranularity(feature.place_type)
      const boundingbox = feature.bbox || undefined
      let estimatedRadiusMeters: number | undefined
      
      if (boundingbox && boundingbox.length === 4) {
        const [lonMin, latMin, lonMax, latMax] = boundingbox
        estimatedRadiusMeters = Math.round(
          calculateDistanceMeters(latMin, lonMin, latMax, lonMax) / 2
        )
      }
      
      return {
        latitude,
        longitude,
        displayName: feature.place_name,
        osmType: undefined,
        osmClass: undefined,
        type: feature.text,
        boundingbox,
        granularity,
        estimatedRadiusMeters,
        importance: feature.relevance,
        raw: feature
      }
    })

    const rankMap: Record<ForwardGeocodeResult['granularity'], number> = {
      exact: 6,
      street: 5,
      neighbourhood: 4,
      city: 3,
      region: 2,
      country: 1,
      unknown: 0
    }

    enriched.sort((a, b) => {
      const ra = rankMap[a.granularity as keyof typeof rankMap] ?? 0
      const rb = rankMap[b.granularity as keyof typeof rankMap] ?? 0
      if (ra !== rb) return rb - ra
      const ea = a.estimatedRadiusMeters ?? Number.POSITIVE_INFINITY
      const eb = b.estimatedRadiusMeters ?? Number.POSITIVE_INFINITY
      if (ea !== eb) return ea - eb
      return (b.importance ?? 0) - (a.importance ?? 0)
    })

    return enriched[0] || null
  } catch (err) {
    console.error({ event: 'mapbox_geocode_failure', error: err instanceof Error ? err.message : err })
    return null
  }
}

// Forward geocoding with Nominatim (OpenStreetMap)
export async function getCoordinatesFromLocation(locationText: string): Promise<ForwardGeocodeResult | null> {
  try {
    if (!locationText || locationText.trim() === '') return null

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        locationText
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AttendanceApp/1.0 (+https://your-org.example)'
        }
      }
    )

    if (!res.ok) {
      console.error({ event: 'geocode_forward_error', status: res.status, statusText: res.statusText })
      throw new Error('LOCATION_SERVICE_ERROR')
    }

    const arr = await res.json()
    if (!arr || arr.length === 0) return null

    // Build enriched results with granularity and estimated radius
    const enriched: ForwardGeocodeResult[] = arr.map((result: any) => {
      const t: string | undefined = result.type
      const c: string | undefined = result.class
      const granularity = detectGranularity(t, c)

      let estimatedRadiusMeters: number | undefined
      if (result.boundingbox && result.boundingbox.length === 4) {
        const [latMinStr, latMaxStr, lonMinStr, lonMaxStr] = result.boundingbox
        const latMin = parseFloat(latMinStr)
        const latMax = parseFloat(latMaxStr)
        const lonMin = parseFloat(lonMinStr)
        const lonMax = parseFloat(lonMaxStr)
        estimatedRadiusMeters = Math.round(calculateDistanceMeters(latMin, lonMin, latMax, lonMax) / 2)
      }

      const importance = result.importance ? parseFloat(result.importance) : 0

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        osmType: result.osm_type,
        osmClass: result.class,
        type: result.type,
        boundingbox: result.boundingbox as any,
        granularity,
        estimatedRadiusMeters,
        importance,
        raw: result
      }
    })

    // Ranking preference: prefer higher granularity
    const rankMap: Record<ForwardGeocodeResult['granularity'], number> = {
      exact: 6,
      street: 5,
      neighbourhood: 4,
      city: 3,
      region: 2,
      country: 1,
      unknown: 0
    }

    enriched.sort((a, b) => {
      const ra = rankMap[a.granularity as keyof typeof rankMap] ?? 0
      const rb = rankMap[b.granularity as keyof typeof rankMap] ?? 0
      if (ra !== rb) return rb - ra
      const ea = a.estimatedRadiusMeters ?? Number.POSITIVE_INFINITY
      const eb = b.estimatedRadiusMeters ?? Number.POSITIVE_INFINITY
      if (ea !== eb) return ea - eb
      return (b.importance ?? 0) - (a.importance ?? 0)
    })

    return enriched[0] || null
  } catch (err) {
    console.error({ event: 'geocode_forward_failure', error: err instanceof Error ? err.message : err })
    return null
  }
}

// Reverse geocode to human-readable address
export async function getHumanReadableLocation(coordinates: GeolocationCoordinates): Promise<string> {
  try {
    const location = await getCoordinatesFromLocation(`${coordinates.latitude},${coordinates.longitude}`)
    if (!location) return `Coordinates: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
    return location.displayName || `Coordinates: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
  } catch (err) {
    console.error({ event: 'human_readable_failure', error: err instanceof Error ? err.message : err })
    return `Coordinates: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
  }
}

// Convenience format
export function formatCoordinates(coordinates: GeolocationCoordinates): string {
  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
}