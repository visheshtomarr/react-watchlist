import { useEffect } from "react";

export function useKey(key, action) {
    useEffect(() => {
        function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
            }
        }
        document.addEventListener('keydown', callback);

        // We will need to remove the event listener after one movie
        // is mounted otherwise, if any other movie is mounted, it will
        // again add event listener to the document.
        return function () {
            document.removeEventListener('keydown', callback);
        }
    }, [key, action])
}