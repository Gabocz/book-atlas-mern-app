let geolocation = {}

export const getGeoLocation = async (location) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
      const data = await response.json()
      
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
      
      return geolocation
      
    } catch (e) {
      console.log(e)
    }
  }
