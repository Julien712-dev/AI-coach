import { useState, useEffect } from 'react'
import { requestPermissionAsync, getCurrentPositionAsync, Accuracy, reverseGeocodeAsync } from 'expo-location'

// run callback whenever receive a new position update
export default  () => {
  const [location, setLocation] = useState(null)
  const [district, setDistrict] = useState(null)

  useEffect( async () => {
    await requestPermissionAsync()
  }, [])

  const updateLocation = async () => {
    await getCurrentPositionAsync({accuracy: Accuracy.Balanced})
      .then( async (response) => {
        setLocation(response.coords)
        let address = await reverseGeocodeAsync(response.coords)
        setDistrict(address[0].district)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return { updateLocation, location, district }
}