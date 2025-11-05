import { useFavorite } from "@/hooks/useFavorite"
import { ScrollArea } from "./ui/scroll-area"
import FavoriteCityTablet from "./FavoriteCityTablet"


const FavoriteCities = () => {
  
    const {favorites, removeFavorite} = useFavorite()

    if (!favorites.length) {

        return null
    }

    return (
        
        <>

            <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
            <ScrollArea className="w-full pb-4">

                <div className="flex gap-4">

                    {
                        favorites.map((city) => {

                            return (

                                <FavoriteCityTablet key={city.id} {...city} onRemove={() => removeFavorite.mutate(city.id)} />
                            )
                        })
                    }
                </div>
            </ScrollArea>
        </>
    )
}

export default FavoriteCities