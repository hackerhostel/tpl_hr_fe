import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchRole = (roleId) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchRole = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await axios.get(`/designations/${roleId}`)
            const roleResponse = response?.data?.body?.designation;

            if (roleResponse?.designation?.id) {
                setLoading(false)
                setData(roleResponse)
            }
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    };

    useEffect(() => {
        if (roleId !== 0) {
            fetchRole()
        }
    }, [roleId]);

    return {data, error, loading, refetch: fetchRole};
};

export default useFetchRole;
