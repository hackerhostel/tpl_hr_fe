import { useRef, useState, useEffect } from "react";
import MoveProjectPopup from "./TaskOptionPopup/MoveProject";
import ChangeTypePopup from "./TaskOptionPopup/ChangeType";
import SubTaskPopup from "./TaskOptionPopup/SubTask";
import MoveSprint from "./TaskOptionPopup/moveSprint"
import MoveSprintPopup from "./TaskOptionPopup/moveSprint";
import CloneIssue from "./TaskOptionPopup/CloneIssue"

const TaskOptionsPopup = ({ isOpen, onClose, currentProject, projectOptions }) => {
    const menuRef = useRef(null);
    const movePopupRef = useRef(null);
    const changeTypePopupRef = useRef(null);
    const subTaskPopupRef = useRef(null);
    const moveSprintRef = useRef(null);
    const cloneIssueRef = useRef(null);

    const [isMovePopupOpen, setMovePopupOpen] = useState(false);
    const [isChangeTypePopupOpen, setChangeTypePopupOpen] = useState(false);
    const [isSubTaskPopupOpen, setChangeSubTaskPopupOpen] = useState(false);
    const [isMoveSprintPopup, setChangeSprintPopup] = useState(false);
    const [isCloneIssue, setIsCloneIssue] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setMovePopupOpen(false);
            setChangeTypePopupOpen(false);
            setChangeSubTaskPopupOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !movePopupRef.current?.contains(event.target) &&
                !changeTypePopupRef.current?.contains(event.target) &&
                !subTaskPopupRef.current?.contains(event.target) &&
                !moveSprintRef.current?.contains(event.target) &&
                !cloneIssueRef.current?.contains(event.target)
            ) {
                if (!isMovePopupOpen && !isChangeTypePopupOpen && !isSubTaskPopupOpen && !isMoveSprintPopup && !isCloneIssue) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, isMovePopupOpen, isChangeTypePopupOpen, isSubTaskPopupOpen]);

    const handleMoveClick = () => {
        setMovePopupOpen(true);
    };

    const handleChangeTypeClick = () => {
        setChangeTypePopupOpen(true);
    };

    const handleChangeSubTask = () => {
        setChangeSubTaskPopupOpen(true);
    };

    const handleChangeSprint = () => {
        setChangeSprintPopup(true);
    }

    const handleCloneIssue = () => {
        setIsCloneIssue(true);
    }

    if (!isOpen) return null;

    return (
        <>
            <div
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
                ref={menuRef}
            >
                <ul className="py-2 text-text-color">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleMoveClick}>
                        Move Project
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleChangeTypeClick}>
                        Change Type
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleChangeSubTask}>
                        Convert to Sub Task
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleCloneIssue}>Clone</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleChangeSprint}>Move Sprint</li>
                    <li className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">Delete</li>
                </ul>
            </div>

       
            {isMovePopupOpen && (
                <div ref={movePopupRef}>
                    <MoveProjectPopup
                        isOpen={isMovePopupOpen}
                        onClose={() => setMovePopupOpen(false)}
                    />
                </div>
            )}

            {isChangeTypePopupOpen && (
                <div ref={changeTypePopupRef}>
                    <ChangeTypePopup
                        isOpen={isChangeTypePopupOpen}
                        onClose={() => setChangeTypePopupOpen(false)}
                    />
                </div>
            )}

 
            {isSubTaskPopupOpen && (
                <div ref={subTaskPopupRef}>
                    <SubTaskPopup
                        isOpen={isSubTaskPopupOpen}
                        onClose={() => setChangeSubTaskPopupOpen(false)}
                    />
                </div>
            )}

            {isMoveSprintPopup && (
                <div ref={moveSprintRef}>
                    <MoveSprintPopup
                        isOpen={isMoveSprintPopup}
                        onClose={() => setChangeSprintPopup(false)}
                    />
                </div>
            )}

            {isCloneIssue && (
                <div ref={cloneIssueRef}>
                    <CloneIssue
                        isOpen={isCloneIssue}
                        onClose={() => setIsCloneIssue(false)}
                    />
                </div>
            )}
        </>
    );
};

export default TaskOptionsPopup;
