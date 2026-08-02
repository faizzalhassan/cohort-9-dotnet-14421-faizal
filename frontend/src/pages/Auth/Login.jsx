import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthInput from "../../components/Auth/AuthInput";
import AuthButton from "../../components/Auth/AuthButton";

import authService from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await authService.login(data);

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response));

            toast.success("Welcome back!");

            navigate("/dashboard");

        }
        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue managing your workspace."
        >

            <form onSubmit={handleSubmit(onSubmit)}>

                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    register={register("email", {
                        required: "Email is required"
                    })}
                    error={errors.email}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    register={register("password", {
                        required: "Password is required"
                    })}
                    error={errors.password}
                />

                <div className="auth-options">

                    <label className="remember-me">

                        <input type="checkbox" />

                        Remember me

                    </label>

                    <Link
                        className="forgot-password"
                        to="#"
                    >
                        Forgot Password?
                    </Link>

                </div>

                <AuthButton
                    loading={loading}
                    text="Sign In"
                />

            </form>

            <div className="auth-divider">

                <span>OR</span>

            </div>

            <div className="auth-footer">

                Don't have an account?

                <Link to="/register">

                    Create one

                </Link>

            </div>

        </AuthLayout>

    );

};

export default Login;