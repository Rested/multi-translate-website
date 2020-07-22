import {useState, useEffect} from 'react';

export default function useHash() {
    const [hash, setHash] = useState(window.location.hash);
    const listenToPopstate = () => {
        const windowHash = window.location.hash;
        setHash(windowHash);
    };
    useEffect(() => {
        window.addEventListener("popstate", listenToPopstate);
        return () => {
            window.removeEventListener("popstate", listenToPopstate);
        };
    }, []);
    return hash;
};