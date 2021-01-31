import { useState, useEffect } from 'react'
import { requestPermissionsAsync, getCurrentPositionAsync, Accuracy, reverseGeocodeAsync, getPermissionsAsync } from 'expo-location'

// run callback whenever receive a new position update
export default  () => {
  const [grant, setGrant] = useState(false)
  const [location, setLocation] = useState(null)
  const [district, setDistrict] = useState(null)


  useEffect(() => {
    console.log('in uselocation useeffect');
    const checkPermission = async () => {
      let { status } = await getPermissionsAsync()
      setGrant(status === "granted")
      console.log(grant)
    }
    checkPermission()
    console.log('inuseloc: ', grant);
  }, [])

  const requestLocationPermissionAsync = async () => {
    let { status } = await requestPermissionsAsync()
    setGrant(status === "granted")
  }

  const updateLocationAsync = async () => {
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

  return { requestLocationPermissionAsync, updateLocationAsync, grant, location, district }
}