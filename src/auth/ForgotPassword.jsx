import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { resetPassword } from "aws-amplify/auth";
import FormInput from "../components/FormInput.jsx";
import useValidation from "../utils/use-validation.jsx";
import { ForgotPasswordSchema } from "../state/domains/authModels.js";
import { useToasts } from "react-toast-notifications";
import Logo from "../assets/logo.png"

const ForgotPassword = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [forgotPasswordDetails, setForgotPasswordDetails] = useState({
    email: "",
  });
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const [formErrors] = useValidation(
    ForgotPasswordSchema,
    forgotPasswordDetails
  );

  const hasErrors = formErrors && Object.keys(formErrors).length > 0;

  const handleFormChange = (name, value) => {
    const newForm = { ...forgotPasswordDetails, [name]: value };
    setForgotPasswordDetails(newForm);
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    if (hasErrors) {
      setIsValidationErrorsShown(true);
      return;
    }

    setIsValidationErrorsShown(false);
    setLoading(true);

    try {
      await resetPassword({
        username: forgotPasswordDetails.email,
      });

      addToast("Verification code has been sent to your email", {
        appearance: "success",
        autoDismiss: true,
      });

      history.push("/otpVerification", {
        email: forgotPasswordDetails.email,
        isPasswordReset: true,
      });
    } catch (error) {
      addToast(error.message || "Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10 min-h-screen bg-gray-100">
      <div className=''>
              <img src={Logo}  className='pt-4' alt="" />
            </div>
      <div
        style={{ width: "650px", height: "450px" }}
        className="bg-white text-center shadow-xl rounded-lg p-6"
      >
        <p className="text-4xl font-medium mt-16">Forgot Password</p>
        <span className="block mt-6 text-gray-600">
          Enter your email to receive a verification code
        </span>
        <form
          className="mt-4 space-y-6"
          ref={formRef}
          onSubmit={handleForgotPassword}
        >
          <div className="m-auto pt-8" style={{ width: "420px" }}>
            <FormInput
              type="email"
              name="email"
              formValues={forgotPasswordDetails}
              placeholder="Email Address"
              onChange={({ target: { name, value } }) =>
                handleFormChange(name, value)
              }
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <button
            type="submit"
            style={{ width: "420px" }}
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>
        <div className="text-center mt-5 text-gray-600">
          <Link to="/login" className="text-primary-pink">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
