import CurrentWeather from "@/components/CurrentWeather"
import FavoriteCities from "@/components/FavoriteCities"
import HourlyTemperature from "@/components/HourlyTemperature"
import WeatherSkeleton from "@/components/loadingSkeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import WeatherDetails from "@/components/WeatherDetails"
import WeatherForecast from "@/components/WeatherForecast"
import { useGeoLocation } from "@/hooks/useGeoLocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/useWeather"
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"


const WeatherDashboard = () => {

    const { coordinates, error: locationError, isLoading: locationLoading, getLocation} = useGeoLocation()

    const weatherQuery = useWeatherQuery(coordinates)
    const forecastQuery = useForecastQuery(coordinates)
    const locationQuery = useReverseGeocodeQuery(coordinates)

    const handleRefresh = () => {

        getLocation()
        if (coordinates) {

            // Reload Weather Data
            weatherQuery.refetch()
            forecastQuery.refetch()
            locationQuery.refetch()
        }
    }

    if (locationLoading) {

        return <WeatherSkeleton />
    }

    if (locationError) {

        return (

            <Alert variant="destructive">

                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">

                    <p>{locationError}</p>
                    <Button onClick={getLocation} variant="outline" className="w-fit cursor-pointer">

                        <MapPin className="mr-2 h-4 w-4" />
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (!coordinates) {

        return (

            <Alert variant="destructive">

                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Required</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">

                    <p>Please Enable Location Access to See Your Local Weather.</p>
                    <Button onClick={getLocation} variant="outline" className="w-fit cursor-pointer">

                        <MapPin className="mr-2 h-4 w-4" />
                        Enable Location
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    const locationName = locationQuery.data?.[0]

    if (weatherQuery.error || forecastQuery.error) {

        return (

            <Alert variant="destructive">

                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex flex-col gap-4">

                    <p>Failed to Fetch Weather Data. Please Try Again.</p>
                    <Button onClick={handleRefresh} variant="outline" className="w-fit cursor-pointer">

                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (!weatherQuery.data || !forecastQuery.data) {

        return <WeatherSkeleton />
    }

    return (
        
        <div className="space-y-4">
            
            { /* Favorite Cities */ }
            <FavoriteCities />


            <div className="flex items-center justify-between">

                <h1 className="text-xl font-bold tracking-tight">My Location</h1>
                <Button variant={"outline"} size={"icon"} onClick={handleRefresh} className="cursor-pointer" disabled={weatherQuery.isFetching || forecastQuery.isFetching}>

                    <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="grid gap-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    { /* Current Weather */ }
                    <CurrentWeather data={weatherQuery.data} locationName={locationName} />

                    { /* Hourly Temp */ }
                    <HourlyTemperature data={forecastQuery.data} />
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-start">

                    { /* Details */ }
                    <WeatherDetails data={weatherQuery.data} />

                    { /* Forecast */ }
                    <WeatherForecast data={forecastQuery.data} />
                </div>
            </div>

        </div>
    )
}

export default WeatherDashboard