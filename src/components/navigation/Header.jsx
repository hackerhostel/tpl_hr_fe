import React, {Fragment, useCallback, useState} from "react";
import {Menu, Transition} from "@headlessui/react";
import {useDispatch, useSelector} from "react-redux";
import {BellIcon, UserIcon, ArrowRightStartOnRectangleIcon} from "@heroicons/react/24/outline";
import FormSelect from "../FormSelect.jsx";
import {doSwitchProject, selectProjectList, selectSelectedProject} from "../../state/slice/projectSlice.js";
import {signOut} from 'aws-amplify/auth';
import {selectUser} from "../../state/slice/authSlice.js";
import Notification from "./NotificationPopup.jsx"
import HeaderTaskCreateComponent from "../task/create/HeaderTaskCreateComponent.jsx";
import {Link, useHistory, useLocation} from 'react-router-dom';
import { Dashboard } from "powerbi-client";

const Header = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectSelectedProject);
  const projectList = useSelector(selectProjectList);
  const userDetails = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [newHeaderTaskModalOpen, setNewHeaderTaskModalOpen] = useState(false);
  const location = useLocation();
    const history = useHistory();

  const handleChange = (e, value) => {
    dispatch(doSwitchProject(Number(value)));
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials;
  };

  const MenuItem = ({ link, label }) => (
    <Link
      to={link}
      className={`${
        location.pathname === link
          ? 'text-primary-pink' // When selected, the link is styled with primary-pink
          : '' // Default styling for unselected links
      }`}
    >
      <span
        className={`w-6 h-6 ${
          location.pathname === link ? 'text-primary-pink' : 'text-text-color'
        }`}
      >
        {label} {/* Ensure `label` is being passed correctly */}
      </span>
    </Link>
  );
  


  const getProjectOptions = useCallback(() => {
    return projectList.map((project) => ({
      value: project.id,
      label: project.name,
    }));
  }, [projectList]);

  const openPopUp = () =>{
    setIsOpenPopUp((prevState) => !prevState);
  }

  const closePopUp = () => {
    setIsOpenPopUp(false);
  }

   const handleSignOut = async () => {
      setLoading(true);
      try {
        await signOut({ global: true });
        window.location.reload();
      } finally {
        setLoading(false);
      }
    };

  const userProfile = () => {
    history.push('/profile')
  };

  const closeHeaderCreateTaskModal = () => setNewHeaderTaskModalOpen(false)

  return (
    <div className="flex justify-between h-16 w-full">
      {/* Left Section */}
      <div className="py-3 px-4 w-72">
        <FormSelect
          name="project"
          showLabel={false}
          formValues={{ project: selectedProject?.id }}
          placeholder="Select a project"
          options={getProjectOptions()}
          onChange={handleChange}
        />
      </div>

      <div className="flex space-x-8 text-text-color text-lg ml-72 py-3 px-4 ">
      <MenuItem link="/dashboard" label="Dashboard" />
        <MenuItem link="/profile" label="Employee" />
        <MenuItem link="/projects" label="Role" />
        <MenuItem label="Performance" />
      </div>


      {/* Right Section */}
      <div className="flex items-center mr-6 space-x-3">
        <div>
          <button
              className="w-24 h-10 text-white rounded-lg border border-primary-pink bg-primary-pink cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300"
              onClick={() => setNewHeaderTaskModalOpen(true)}>
            + Employee
          </button>
        </div>
        <div>
          <BellIcon onClick={openPopUp} className="w-7 h-7 m-3 cursor-pointer"/>
        </div>

        <div className="z-50">
          <Notification isOpen={isOpenPopUp} onClose={closePopUp}/>
        </div>

        {/* Divider */}
        <div className="border-l border-gray-300 h-8"></div>

        {/* User Avatar and Menu */}
         <Menu as="div" className="relative inline-block text-left z-50">
                        <Menu.Button
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink">
                          {userDetails.avatar ? (
                            <img
                              src={userDetails.avatar}
                              alt={`${userDetails.firstName} ${userDetails.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                              {userDetails.firstName?.[0]}
                              {userDetails.lastName?.[0]}
                            </div>
                          )}
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            className="absolute -top-16 right-[1rem] mt-28 w-64 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="flex items-center gap-3 px-4 py-3">
                              {userDetails.avatar ? (
                                <img
                                  src={userDetails.avatar}
                                  alt={`${userDetails.firstName} ${userDetails.lastName}`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold inline-block">
                                  {userDetails.firstName?.[0]}
                                  {userDetails.lastName?.[0]}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {`${userDetails.firstName} ${userDetails.lastName}`}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {userDetails.email}
                                </p>
                              </div>
                            </div>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700"
                                      } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                                    onClick={userProfile}
                                    disabled={loading}
                                  >
                                    <UserIcon className="w-4 h-4 mr-3 cursor-pointer" />
                                    My Profile
                                  </button>
                                )}
                              </Menu.Item>
                              {/* <Menu.Item>
                                    {({active}) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700"
                                            } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                                            onClick={handleSettingsClick}
                                            disabled={loading}
                                        >
                                          <CogIcon className="w-4 h-4 mr-3 cursor-pointer"/>
                                          Settings
                                        </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({active}) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700"
                                            } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                                            onClick={handleNotificationClick}
                                            disabled={loading}
                                        >
                                          <BellIcon className="w-4 h-4 mr-3 cursor-pointer"/>
                                          Notifications
                                        </button>
                                    )}
                                  </Menu.Item> */}
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700"
                                      } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                                    onClick={handleSignOut}
                                    disabled={loading}
                                  >
                                    <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-3 cursor-pointer" />
                                    Log Out
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
     
      </div>
      <HeaderTaskCreateComponent isOpen={newHeaderTaskModalOpen} onClose={closeHeaderCreateTaskModal}/>
    </div>
  );
};

export default Header;
