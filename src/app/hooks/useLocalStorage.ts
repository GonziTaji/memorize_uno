import { useState } from "react";

export default function useLocalStorage(key: string, fallbackValue = ''): [string, (value: string) => void] {
    let initialValue: string | null = '';

    if (typeof window !== 'undefined') {
        initialValue = window.localStorage.getItem(key);
    }
    
    const setItem = (key: string, value: string) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
        }
    }

    const [storedValue, setStoredValue] = useState(initialValue || fallbackValue);
    
    const setValue = (value: string) => {
        setItem(key, value);
        setStoredValue(value);
    }
    
    return [storedValue, setValue];
}