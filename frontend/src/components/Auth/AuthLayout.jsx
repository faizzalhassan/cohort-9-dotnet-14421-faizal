import "./AuthLayout.css";

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-card">

                <div className="auth-logo">TM</div>

                <div className="auth-header">
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>

                {children}

            </div>
        </div>
    );
};

export default AuthLayout;