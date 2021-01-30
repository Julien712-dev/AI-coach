import { useState, useEffect } from 'react'
import { requestPermissionsAsync, getCurrentPositionAsync, Accuracy, reverseGeocodeAsync } from 'expo-location'

// run callback whenever receive a new position update
export default  () => {
  const [grant, setGrant] = useState(false)
  const [location, setLocation] = useState(null)
  const [district, setDistrict] = useState(null)


  useEffect( async () => {
    let { status } = await requestPermissionsAsync()
    setGrant(status)
    return () => {
      
    }
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

  return { updateLocation, grant, location, district }
}