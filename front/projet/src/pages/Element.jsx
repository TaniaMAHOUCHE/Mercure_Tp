import * as React from "react";
import {useEffect, useState} from "react";
import axios from 'axios';


export const Element = () =>  {
    const [bid, setBid] = useState(0);
    const [winnerBid, setWinnerBid] = useState(0);

    useEffect(() => {

        const url = new URL('http://localhost:9090/.well-known/mercure');

        url.searchParams.append('topic', 'https://example.com/my-private-topic');
        url.searchParams.append('topic', 'https://example.com/info-data');

        const eventSource = new EventSource(url, {withCredentials: true});

        eventSource.onmessage = ({event}) => {
            const results = JSON.parse(event.data);
            setWinnerBid(results.winnerBid);

        }



        return() => {
            eventSource.close();
        }
    }, []);
} ;