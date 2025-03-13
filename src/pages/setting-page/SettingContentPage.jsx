import {useSelector} from "react-redux";
import {selectSelectedProjectFromList} from "../../state/slice/projectSlice.js";

const SettingContentPage = () => {
  const selectedProject = useSelector(selectSelectedProjectFromList);

  return (
   <>
     {!selectedProject ? (
       <div className="p-4 text-center">No Details</div>
     ): (
       <div className="p-4 text-center">selected id: {selectedProject?.id}</div>
     )
     }
   </>
  )
}

export default SettingContentPage;