import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";


interface GeolocationState {

    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export function useGeoLocation() {

    const [locationData, setLocationData] = useState<GeolocationState>({

        coordinates: null,
        error: null,
        isLoading: true,
    })

    const getLocation = () => {

        setLocationData((prev) => ({...prev, isLoading: true, error: null}))

        if (!navigator.geolocation) {

            setLocationData({

                coordinates: null,
                error: "GeoLocation is not Supported In Your Browser",
                isLoading: false,
            })

            return
        }

        navigator.geolocation.getCurrentPosition((position) => {

            setLocationData({

                coordinates: {

                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false,
            })
        }, (error) => {

            let errorMessage: string;
            
            switch(error.code) {

                case error.PERMISSION_DENIED: 
                    errorMessage = "Location Permission Denied. Please Enable Location Access."
                    break;
                
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location Information is Unavailable."
                    break;

                case error.TIMEOUT:
                    errorMessage = "Location Request Timed Out."
                    break;

                default:
                    errorMessage = "An Unknown Error Occurred."
            }

            setLocationData({

                coordinates: null,
                error: errorMessage,
                isLoading: false,
            })
        }, {

            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        })
    }

    useEffect(() => {

        getLocation()

    }, [])

    return { ...locationData, getLocation}
}