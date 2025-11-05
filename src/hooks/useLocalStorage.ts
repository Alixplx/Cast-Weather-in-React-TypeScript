import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initValue: T) {

    const [storedValue, setStoredValue] = useState<T>(() => {

        try {
            
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item): initValue

        } catch (error) {
            
            console.log(error)
            return initValue
        }
    })


    useEffect(() => {

        try {
            
            window.localStorage.setItem(key, JSON.stringify(storedValue))

        } catch (error) {
            
            console.log(error)
        }

    }, [key, storedValue])

    return [storedValue, setStoredValue] as const
}