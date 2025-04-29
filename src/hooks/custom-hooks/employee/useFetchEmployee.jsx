import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchEmployee = (employeeId) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchEmployee = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await axios.get(`/employees/${employeeId}`)
            const employeeResponse = response?.data?.body;

            if (employeeResponse?.employee?.id) {
                setLoading(false)
                setData(employeeResponse)
            }
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        if (employeeId !== 0) {
            fetchEmployee()
        }
    }, [employeeId]);

    return {data, error, loading, refetch: fetchEmployee};
};

export default useFetchEmployee;
