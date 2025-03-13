import { useSelector } from "react-redux";
import { selectSelectedProjectFromList } from "../../state/slice/projectSlice.js";
import ReleaseEdit from "./ReleaseEdit.jsx";

const ReleaseContentPage = () => {
  const selectedProject = useSelector(selectSelectedProjectFromList);

  return (
    <>

    <div>
      <ReleaseEdit/>
    </div>
      {/* {!selectedProject ? (
        <div className="p-4 text-center">No Details
        
        </div>
      ) : (
        <div className="p-4 text-center">
          <div>Selected Project Name: {selectedProject.name}
            
          </div>
        </div>
      )} */}
    </>
  );
};

export default ReleaseContentPage;
