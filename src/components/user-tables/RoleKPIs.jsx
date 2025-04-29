import React, {useState} from "react";

const RoleKPIs = ({kpis}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < kpis.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const kpi = kpis[currentIndex];

    return (
        <div
            style={{width: "100%", height: "330px"}}
            className="bg-white rounded-md p-5 flex flex-col justify-between"
        >
            {!kpis || kpis.length === 0 ? (
                <>
                    <div className="flex space-x-3 items-center border-b pb-2">
                        <div className="flex space-x-8">
                            <span className="text-lg font-semibold text-text-color">KPIs</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <div className="flex space-x-3 items-center border-b pb-2">
                            <div className="flex space-x-8">
                                <span
                                    className="text-lg font-semibold text-text-color">KPI ({currentIndex + 1} / {kpis.length})</span>
                                <span className="text-sm font-semibold text-text-color">{kpi.name}</span>
                            </div>
                        </div>


                        <div className="mt-3">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Description</span>
                                <span className="text-text-color text-sm">{kpi.description}</span>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm font-bold">Formula</span>
                                <p className="text-text-color text-sm">{kpi.formula}</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-center items-center gap-3 mt-4 pt-2 border-t">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className={`px-2 py-1 rounded ${currentIndex === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            {"<"}
                        </button>
                        {kpis.map((_, index) => (<button
                            key={index}
                            className={`px-2 py-1 text-sm ${index === currentIndex ? "text-red-500 font-bold" : "text-gray-500"}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {index + 1}
                        </button>))}
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === kpis.length - 1}
                            className={`px-2 py-1 rounded ${currentIndex === kpis.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            {">"}
                        </button>
                    </div>
                </>
            )}
        </div>);
};

export default RoleKPIs;
