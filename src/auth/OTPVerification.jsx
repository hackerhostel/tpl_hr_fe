import React, { useState, useEffect, useRef } from 'react';
import {doVerifyOTP} from "../state/slice/registerSlice.js";
import {useDispatch} from "react-redux";
import {useToasts} from "react-toast-notifications";
import {useHistory, useLocation} from "react-router-dom";

const OTPVerification = () => {
    const history = useHistory();
    const {addToast} = useToasts();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isResendActive, setIsResendActive] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const timerRef = useRef(null);
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startTimer = () => {
        setIsResendActive(false);
        setTimer(60);
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setIsResendActive(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleInput = (index, value) => {
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.every(char => /^\d$/.test(char))) {
            setOtp(pastedData.concat(Array(6 - pastedData.length).fill('')));
        }
    };

    const handleContinue = async () => {
        if (otp.every(digit => digit !== '')) {
            // onVerify(otp.join(''));
            try {
                const result = await dispatch(doVerifyOTP({
                    username: email, // Make sure you have access to the email/username used in registration
                    otp: otp.join('')
                }));

                history.push('/login');
                addToast('OTP Verification success', {appearance: 'success'});
            } catch (error) {
                addToast('OTP Verification failed ', {appearance: 'error'});
            }
        }
    };

    const handleResend = () => {
        if (isResendActive) {
            // resendOTP();
            startTimer();
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
            <h4 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                OTP Verification
            </h4>

            <p className="text-center text-gray-600 mb-2">
                Enter the OTP Sent to your email address
            </p>

            <p className="text-center text-pink-500 mb-6">
                {String(Math.floor(timer / 60)).padStart(2, '0')}:
                {String(timer % 60).padStart(2, '0')} sec
            </p>

            <div className="flex justify-center gap-4 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInput(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold
                     focus:border-pink-500 focus:outline-none transition-colors"
                    />
                ))}
            </div>

            <button
                onClick={handleContinue}
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600
                 transition-colors mb-4 font-medium"
            >
                Continue
            </button>

            <p className="text-center text-gray-600">
                OTP Not Received?{' '}
                <button
                    onClick={handleResend}
                    className={`${
                        isResendActive
                            ? 'text-pink-500 hover:text-pink-600'
                            : 'text-gray-400 cursor-not-allowed'
                    } font-medium`}
                >
                    Resend
                </button>
            </p>
        </div>
    );
};

export default OTPVerification;