import { useEffect, useState } from "react";

export function useLocalStorage(initialState, key) {
    // We are using a callback function to set the watched state initially
    // from the local storage.
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    // This hook will synchronize the watched movie state with the movies
    // in local storage.
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}