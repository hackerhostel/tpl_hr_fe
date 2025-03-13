import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from "../components/FormInput.jsx";
import useValidation from "../utils/use-validation.jsx";
import { ForgotPasswordSchema } from "../state/domains/authModels.js";

const ForgotPassword = () => {
  const [forgotPasswordDetails, setForgotPasswordDetails] = useState({ email: '' });
  const [isValidationErrorsShown, setIsValidationErrorsShown] = useState(false);
  const formRef = useRef(null);
  const [formErrors] = useValidation(ForgotPasswordSchema, forgotPasswordDetails);

  const handleFormChange = (name, value) => {
    const newForm = { ...forgotPasswordDetails, [name]: value };
    setForgotPasswordDetails(newForm);
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    if (formErrors) {
      setIsValidationErrorsShown(true);
      return;
    }

    setIsValidationErrorsShown(false);
    // Handle form submission 
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div style={{ width: '650px', height: '450px' }} className='bg-card-white text-center shadow-1xl rounded-lg p-6'>
        <p className="text-4xl font-medium mt-16">Forgot Password</p>
        <span className="block mt-6 text-text-color">Enter your email to send code</span>
        <form className="mt-4 space-y-6" ref={formRef} onSubmit={handleForgotPassword}>
          <div className=" m-auto pt-8" style={{width:'420px'}}>
            <FormInput
              type="email"
              name="email"
              formValues={forgotPasswordDetails}
              placeholder="Email Address"
              onChange={({ target: { name, value } }) => handleFormChange(name, value)}
              formErrors={formErrors}
              showErrors={isValidationErrorsShown}
            />
          </div>
          <input
            type="submit"
            style={{width:'420px'}}
            value="Confirm"
            className="btn-login"
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
