import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import FormInput from "../components/FormInput";
import LoginImage from "../images/register.jpg";
import { RegisterSchema } from "../state/domains/authModels";
import { doRegisterUser } from "../state/slice/registerSlice";
import useValidation from "../utils/use-validation";
import Logo from "../assets/logo.png"

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts(); // Add toast notifications
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    organization: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const formRef = useRef(null);
  const [formErrors] = useValidation(RegisterSchema, registerDetails);
  const location = useLocation();

  const handleFormChange = (name, value) => {
    const newForm = { ...registerDetails, [name]: value };
    setRegisterDetails(newForm);
  };

  const register = async (event) => {
    event.preventDefault();

    if (formErrors && Object.keys(formErrors).length > 0) {
      setIsValidationErrorsShown(true);
      return;
    }

    if (registerDetails.password !== registerDetails.confirmPassword) {
      addToast("Passwords do not match", { appearance: "error" });
      return;
    }

    setIsValidationErrorsShown(false);
    setLoading(true); // Set loading state to true

    try {
      // Dispatch registration action
      await dispatch(doRegisterUser(registerDetails));

      // Instead of redirecting to login, redirect to OTP verification
      addToast(
        "Registration successful! Please verify your email with the OTP sent.",
        {
          appearance: "success",
          autoDismiss: true,
        }
      );

      // Redirect to OTP verification page with email
      history.push("/otpVerification", {
        email: registerDetails.username,
        isPasswordReset: false, // Explicitly mark this is not password reset flow
      });
    } catch (error) {
      addToast(error.message || "Registration failed. Please try again.", {
        appearance: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
       <div className=''>
              <img src={Logo}  className='pt-4' alt="" />
            </div>
    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-2xl m-10">
      <div
        className="p-10 border border-border-color"
        style={{ width: "600px" }}
      >
        <div className="">
          <span className="flex text-4xl items-center justify-center font-semibold">
            Sign Up
          </span>
          <form className="mt-4 space-y-6" ref={formRef} onSubmit={register}>
            <div className="mb-6">
              <FormInput
                type="text"
                name="organization"
                formValues={registerDetails}
                placeholder="Organization"
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
            <div className="mb-6 flex space-x-2 justify-between">
              <div className="w-full">
                <FormInput
                  type="text"
                  name="firstName"
                  formValues={registerDetails}
                  placeholder="First Name"
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>
              <div className="w-full">
                <FormInput
                  type="text"
                  name="lastName"
                  formValues={registerDetails}
                  placeholder="Last Name"
                  onChange={({ target: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                  formErrors={formErrors}
                  showErrors={isValidationErrorsShown}
                />
              </div>
            </div>
            <div className="mb-6">
              <FormInput
                type="text"
                name="username"
                formValues={registerDetails}
                placeholder="Email"
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
            <div className="mb-6">
              <FormInput
                type="password"
                name="password"
                formValues={registerDetails}
                showPasswordVisibilityIcon={true}
                placeholder="Password"
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
            <div className="mb-6">
              <FormInput
                type="password"
                name="confirmPassword"
                formValues={registerDetails}
                placeholder="Confirm Password"
                showPasswordVisibilityIcon={true}
                onChange={({ target: { name, value } }) =>
                  handleFormChange(name, value)
                }
                formErrors={formErrors}
                showErrors={isValidationErrorsShown}
              />
            </div>
            <input type="submit" value="Sign Up" className="btn-login" />
          </form>
          <div className="text-center mt-5 text-text-color">
            Already have an account?
            <Link
              to={{ pathname: "/login", state: { from: location } }}
              className="text-primary-pink ml-2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Register;
