import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";


interface SearchHistoryItem {

    id: string
    query: string
    lat: number
    lon: number
    name: string
    country: string
    state?: string
    searchedAt: number
}

export function useSearchHistory() {

    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>("searchHistory", [])

    const queryHistory = useQuery({

        queryKey: ["searchHistory"],
        queryFn: () => history,
        initialData: history
    })

    const queryClient = useQueryClient()

    const addToHistory = useMutation({

        mutationFn: async ( search: Omit<SearchHistoryItem, "id" | "searchedAt">) => {

            const newSearch: SearchHistoryItem = {

                ...search,
                id: `${search.lat}-${search.lon}-${Date.now()}`,
                searchedAt: Date.now(),
            }

            const filteredHistory = history.filter((item) => !(item.lat === search.lat && item.lon === search.lon))

            const newHistory = [newSearch, ...filteredHistory].slice(0, 10)

            setHistory(newHistory)
            
            return newHistory
        },

        onSuccess: (newHistory) => {

            queryClient.setQueryData(["searchHistory"], newHistory)
        }
    })

    const clearHistory = useMutation({

        mutationFn: async () => {

            setHistory([])
            return []
        },

        onSuccess: () => {

            queryClient.setQueryData(["searchHistory"], [])
        }
    })

    return {

        history: queryHistory.data?? [],
        addToHistory,
        clearHistory,
    }
}