import type { WeatherData } from "@/api/types"
import { useFavorite } from "@/hooks/useFavorite"
import { Button } from "./ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"


interface FavoriteButtonProps {

    data: WeatherData
}

const FavoritesButton = ({ data}: FavoriteButtonProps) => {
  
    const {addFavorite, removeFavorite, isFavorite} = useFavorite()
    const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon)


    const handleToggleFavorite = () => {

        if (isCurrentlyFavorite) {

            removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
            toast.error(`Removed ${data.name} From Favorites`)

        } else {

            addFavorite.mutate({

                name: data.name,
                lat: data.coord.lat,
                lon: data.coord.lon,
                country: data.sys.country,
            })
            toast.success(`Added ${data.name} To Favorites`)
        }
    }

    return (
        
        <Button variant={isCurrentlyFavorite ? "default" : "outline"} size={"icon"} onClick={handleToggleFavorite}
                className={`cursor-pointer ${isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}>

            <Star className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`} />
        </Button>
    )
}

export default FavoritesButton