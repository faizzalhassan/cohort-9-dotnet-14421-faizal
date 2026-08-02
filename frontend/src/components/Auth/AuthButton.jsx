import "./AuthButton.css";

const AuthButton = ({ loading, text }) => {
    return (
        <button
            className="auth-button"
            disabled={loading}
            type="submit"
        >
            <span className="auth-button-inner">
                {loading && <span className="auth-button-spinner" />}
                {loading ? "Please wait…" : text}
            </span>
        </button>
    );
};

export default AuthButton;