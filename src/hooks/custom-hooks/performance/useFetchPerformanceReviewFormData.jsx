import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchPerformanceReviewFormData = (testPlanId) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchFormData = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await axios.get(`/performance-reviews/form-data`)
            const formResponse = response?.data?.body;

            setLoading(false)
            setData(formResponse)
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchFormData()
    }, []);

    return {data, error, loading};
};

export default useFetchPerformanceReviewFormData;
