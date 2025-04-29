import React, { useRef, useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import useValidation from "../utils/use-validation.jsx";
import FormInput from "../components/FormInput.jsx";
import { useToasts } from "react-toast-notifications";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginImage from '../images/login.png';
import { LoginSchema } from "../state/domains/authModels.js";
import {doGetWhoAmI} from "../state/slice/authSlice.js";
import Spinner from "../components/Spinner.jsx";
import Logo from "../assets/logo.png"

const Login = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [enabled, setEnabled] = useState(true);
  const history = useHistory();
  const location = useLocation();
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(LoginSchema, loginDetails);

  const handleFormChange = (name, value) => {
    const newForm = { ...loginDetails, [name]: value };
    setLoginDetails(newForm);
  };

  const login = async (event) => {
    event.preventDefault();

    if (formErrors) {
      setIsValidationErrorsShown(true);
      return;
    }

    if (loading) {
      return;
    }

    

    try {
      const response = await signIn(loginDetails)

      if (response.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        history.push('/inviteUserRegister', {email: loginDetails.username});
        return;
      }

      dispatch(doGetWhoAmI())
      addToast('logged in Successfully', { appearance: 'success', autoDismiss: true });
      formRef.current.reset();
      history.push('/dashboard');
    } catch (e) {
      addToast(e.message, { appearance: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    if (location.pathname !== '/register') {
      history.push('/register');
    }
  };

  // const navigateToForgotPassword = () => {
  //   if(location.pathname !== '/forgot-password') {
  //     history.push('/forgot-password')
  //   }
  // };
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className=''>
        <img src={Logo}  className='pt-4' alt="" />
      </div>
      <div className='flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl m-7'>
  
        <div  className="p-10 border border-border-color"
          style={{width:"600px"}}>
          <div className=''>
            <div>
            <span className=" flex text-4xl items-center justify-center font-semibold">
                Sign In
              </span>
            </div>
            <form className="mt-10 space-y-6" ref={formRef} onSubmit={login}>
              <div className="mb-6">
                <FormInput
                  type="text"
                  name="username"
                  formValues={loginDetails}
                  placeholder="Email Address"
                  onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>
              <div className="mb-6">
                <FormInput
                  type="password"
                  name="password"
                  formValues={loginDetails}
                  placeholder="Password"
                  onChange={({ target: { name, value } }) => handleFormChange(name, value)}
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>
              <div className='flex justify-end  w-full py-4'>
                <Link to="/forgot-password" className="text-md text-mainColor">Forgot password</Link>
              </div>
              <input
                type="submit"
                value="Sign In"
                className="btn-login"
              />
            </form>
            <div className="text-center mt-5 text-textColor">
              Don't have an account
              <span onClick={navigateToRegister} className="text-primary-pink cursor-pointer"> Sign Up for free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
