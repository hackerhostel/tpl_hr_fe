import React, {useEffect, useState} from 'react';
import SearchBar from "../../components/SearchBar.jsx";
import useGraphQL from "../../hooks/useGraphQL.jsx";
import SkeletonLoader from "../../components/SkeletonLoader.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {Accordion} from "../../components/Accordian.jsx";
import {ChevronRightIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {getScreensByProject} from "../../graphql/setting/ScreenQueries/queries.js";

const ScreenListPage = ({selectedProject}) => {
    // const dispatch = useDispatch();
    const {makeRequest, loading, error} = useGraphQL();

    const [screens, setScreens] = useState([]);
    const [filteredScreens, setFilteredScreens] = useState([]);

    useEffect(() => {
        const fetchScreens = async () => {
            const query = getScreensByProject;
            const variables = {'projectID': selectedProject?.id};
            const response = await makeRequest(query, variables);

            const screensResponse = response?.data?.listScreensByProject;
            if (screensResponse && Array.isArray(screensResponse)) {
                setScreens(screensResponse)
                setFilteredScreens(screensResponse)
            }
        };

        fetchScreens();
    }, []);

    const handleSearch = (term) => {
        if (term.trim() === '') {
            setFilteredScreens(screens);
        } else {
            const filtered = screens.filter(cf =>
                cf?.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredScreens(filtered);
        }
    };

    if (loading) return <div className="p-2"><SkeletonLoader/></div>;
    if (error) return <ErrorAlert message={error.message}/>;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3">
                <Accordion name={'Screens'} addText={'Add New'}>
                    <div className="py-3">
                        <SearchBar onSearch={handleSearch}/>
                    </div>
                    {filteredScreens.map((element, index) => (
                        <button
                            key={index}
                            className="flex justify-between items-center p-3 my-2 border border-gray-200 rounded-md w-full gap-2 hover:bg-gray-100"
                            // onClick={() => {
                            //     dispatch(setSelectedProjectFromList(index))
                            // }}
                        >
                            <div className="text-left">
                                <div className="font-bold text-black mb-1">{element?.name}</div>
                                <div className="text-xs text-gray-600">{element?.projects[0]?.name}</div>
                            </div>
                            <div className={"flex gap-1"}>
                                <TrashIcon className={"w-4 h-4 text-pink-700"}/>
                                <ChevronRightIcon className={"w-4 h-4 text-black"}/>
                            </div>
                        </button>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default ScreenListPage;