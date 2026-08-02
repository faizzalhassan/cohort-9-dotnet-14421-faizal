import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthInput from "../../components/Auth/AuthInput";
import AuthButton from "../../components/Auth/AuthButton";

import authService from "../../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            await authService.register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password
            });

            toast.success("Account created successfully!");

            navigate("/login");

        }
        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration failed."
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout
            title="Create Account"
            subtitle="Create your account to start managing projects."
        >

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="grid-2">

                    <AuthInput
                        label="First Name"
                        placeholder="John"
                        register={register("firstName", {
                            required: "First name is required"
                        })}
                        error={errors.firstName}
                    />

                    <AuthInput
                        label="Last Name"
                        placeholder="Doe"
                        register={register("lastName", {
                            required: "Last name is required"
                        })}
                        error={errors.lastName}
                    />

                </div>

                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    register={register("email", {
                        required: "Email is required"
                    })}
                    error={errors.email}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Create password"
                    register={register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                    error={errors.password}
                />

                <AuthInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    register={register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: value =>
                            value === password ||
                            "Passwords do not match"
                    })}
                    error={errors.confirmPassword}
                />

                <AuthButton
                    loading={loading}
                    text="Create Account"
                />

            </form>

            <div className="auth-divider">
                <span>OR</span>
            </div>

            <div className="auth-footer">

                Already have an account?

                <Link to="/login">

                    Sign In

                </Link>

            </div>

        </AuthLayout>

    );

};

export default Register;