import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchPerformanceReviews = (employeeID, cycleID) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchPerformanceReviews = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await axios.get(`/performance-reviews`, {params: {employeeID, cycleID}});
            const reviewsResponse = response?.data?.body;

            // console.log(reviewsResponse)

            setLoading(false)
            setData(reviewsResponse)
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        if (employeeID > 0 && cycleID > 0)
            fetchPerformanceReviews()
    }, [employeeID, cycleID]);

    return {data, error, loading};
};

export default useFetchPerformanceReviews;
