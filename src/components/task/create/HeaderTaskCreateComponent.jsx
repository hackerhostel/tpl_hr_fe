import React, { useState } from 'react';
import { useRef } from 'react';
import FormInput from "../../FormInput.jsx";
import { XMarkIcon } from "@heroicons/react/24/outline/index.js";

const CreateEmployee = ({ onClose, isOpen }) => {
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        reportTo: '',
        location: '',
        hireDate: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    const handleChange = (e, value) => {
        setFormValues((prev) => ({
            ...prev,
            [e.target.name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simple validation
        let errors = {};
        Object.keys(formValues).forEach((key) => {
            if (!formValues[key]) {
                errors[key] = `${key} is required`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setShowErrors(true);
            setIsSubmitting(false);
            return;
        }

        console.log('Form Submitted:', formValues);
        // Submit form logic here

        setIsSubmitting(false);
        onClose(); // Close the modal after successful submission
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-25 backdrop-blur-sm z-10">
                    <div className="bg-white pl-10 pt-6 pr-6 pb-10 shadow-lg w-3/6 h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-2xl font-semibold">Create Employee</p>
                            <button className="cursor-pointer" onClick={onClose}>
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <form ref={formRef} className="space-y-4 mt-10" onSubmit={handleSubmit}>
                            <FormInput
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="email"
                                name="email"
                                placeholder="Email"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="text"
                                name="department"
                                placeholder="Department"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="text"
                                name="reportTo"
                                placeholder="Report To"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="text"
                                name="location"
                                placeholder="Location"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />
                            <FormInput
                                type="date"
                                name="hireDate"
                                placeholder="Hire Date"
                                formValues={formValues}
                                onChange={handleChange}
                                formErrors={formErrors}
                                showErrors={showErrors}
                            />

                            <div className="flex space-x-4 mt-10 self-end w-full">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateEmployee;
