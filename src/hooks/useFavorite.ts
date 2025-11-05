import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";


interface favoriteCity {

    id: string
    lat: number
    lon: number
    name: string
    country: string
    state?: string
    addedAt: number
}

export function useFavorite() {

    const [favorites, setFavorites] = useLocalStorage<favoriteCity[]>("favorites", [])

    const queryFavorite = useQuery({

        queryKey: ["favorites"],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity,
    })

    const queryClient = useQueryClient()

    const addFavorite = useMutation({

        mutationFn: async ( city: Omit<favoriteCity, "id" | "addedAt">) => {

            const newFavorite: favoriteCity = {

                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now(),
            }

            const existsCity = favorites.some((favo) => favo.id === newFavorite.id)

            if (existsCity) {

                return favorites
            }

            const newFavorites = [...favorites, newFavorite].slice(0, 10)

            setFavorites(newFavorites)
            
            return newFavorites
        },

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["favorites"],
            })
        }
    })

    const removeFavorite = useMutation({

        mutationFn: async (cityId: string) => {

            const newFavorites = favorites.filter((city)=> city.id !== cityId)
            setFavorites(newFavorites)
            return newFavorites
        },

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["favorites"],
            })
        }
    })

    return {

        favorites: queryFavorite.data,
        addFavorite,
        removeFavorite,
        isFavorite: (lat: number, lon: number) => favorites.some((city) => city.lat === lat && city.lon === lon),
    }
}