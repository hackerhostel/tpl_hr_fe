import React, {useState} from "react";

const RoleCompetencies = ({competencies, proficiencyLevels}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < competencies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const competency = competencies[currentIndex];
  const proficiencyLevel = proficiencyLevels.find(pl => pl.id === competency?.proficiencyID)

  return (
      <div
          style={{width: "100%", height: "330px"}}
          className="bg-white rounded-md p-5 flex flex-col justify-between"
      >
        {!competencies || competencies.length === 0 ? (
            <>
              <div className="flex space-x-3 items-center border-b pb-2">
                <div className="flex space-x-8">
                  <span className="text-lg font-semibold text-text-color">Competencies</span>
                </div>
              </div>
            </>
        ) : (
            <>
              <div>
                <div className="flex space-x-3 items-center border-b pb-2">
                  <div>
            <span className="text-lg font-semibold text-text-color">
              Competencies ({currentIndex + 1} / {competencies.length})
            </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between">
                    <span className="text-text-color font-bold">{competency?.name}</span>
                    <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                      {proficiencyLevel?.name}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-text-color">{competency?.description}</p>
                  </div>
                </div>
              </div>


              <div className="flex justify-center items-center gap-3 mt-4 pt-2 border-t">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`px-2 py-1 rounded ${
                        currentIndex === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {"<"}
                </button>
                {competencies.map((_, index) => (
                    <button
                        key={index}
                        className={`px-2 py-1 text-sm ${
                            index === currentIndex ? "text-red-500 font-bold" : "text-gray-500"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    >
                      {index + 1}
                    </button>
                ))}
                <button
                    onClick={handleNext}
                    disabled={currentIndex === competencies.length - 1}
                    className={`px-2 py-1 rounded ${
                        currentIndex === competencies.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {">"}
                </button>
              </div>
            </>)}
      </div>
  );
};

export default RoleCompetencies;
