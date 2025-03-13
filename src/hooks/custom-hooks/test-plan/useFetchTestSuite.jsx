import axios from 'axios';
import {useEffect, useState} from 'react';

const useFetchTestSuite = (testSuiteID) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTestSuite = async () => {
            setLoading(true)
            setError(false)
            try {
                const response = await axios.get(`/test-plans/test-suites/${testSuiteID}`)
                const testSuiteResponse = response?.data?.testSuite;

                if (testSuiteResponse?.testSuite?.id) {
                    setLoading(false)
                    setData(testSuiteResponse)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        };

        if (testSuiteID !== 0) {
            fetchTestSuite()
        }
    }, [testSuiteID]);

    return {data, error, loading};
};

export default useFetchTestSuite;
