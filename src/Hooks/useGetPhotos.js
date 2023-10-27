import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const accessKey = process.env.REACT_APP_CLIENT_ID;

const useGetPhotos = () => {

    const [responsedata, setResponseData] = useState([]);
    const [searchresponsedata, setSearchResponseData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [issearcheddata, setIsearchedData] = useState(false);
    const [prevsearch, setPrevSearch] = useState("no search");

    const getPhotos = async (search) => {
        setIsLoading(true);
        try {
            if (search !== "") {
                const response = await axios.get(`https://api.unsplash.com/photos/random?query=${search}&count=18`, {
                    headers: {
                        Authorization: `Client-ID ${accessKey}`
                    }
                });
                if (prevsearch === search) {
                    setSearchResponseData(prev => [...prev, response.data]);
                }
                else {
                    setSearchResponseData([response.data]);
                    setPrevSearch(search);
                }

                setIsearchedData(true);
            }
            else {
                const response = await axios.get(`https://api.unsplash.com/photos/random?count=18`, {
                    headers: {
                        Authorization: `Client-ID ${accessKey}`
                    }
                });
                setResponseData(prev => [...prev, response.data]);
                setIsearchedData(false);
            }

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setResponseData(null);
        }
    }

    const getPhotosRef = useRef(getPhotos);

    useEffect(() => {
        const fetchData = async () => {
            await getPhotosRef.current("");
        };
        fetchData();
    }, []);

    return [responsedata, searchresponsedata, isLoading, issearcheddata, getPhotos];
}

export default useGetPhotos;
