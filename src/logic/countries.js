const COUNTRIES_API_URL = import.meta.env.VITE_COUNTRIES_API_URL
const COUNTRIES_API_APP_ID = import.meta.env.VITE_COUNTRIES_API_APP_ID

export async function getCountry (place) {
  const response = await fetch(`${COUNTRIES_API_URL}?q=${place}&limit=1&appid=${COUNTRIES_API_APP_ID}`)
  const json = await response.json()
  return json[0].country
}