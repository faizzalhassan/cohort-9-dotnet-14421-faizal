import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import "./AuthInput.css";

const AuthInput = ({ label, type = "text", placeholder, register, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <div className="input-wrapper">
                <input
                    className={`auth-input${error ? " input-error" : ""}`}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    {...register}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>
            {error && <small className="error-text">{error.message}</small>}
        </div>
    );
};

export default AuthInput;