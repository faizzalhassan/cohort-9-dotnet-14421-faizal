import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import "./LogoutButton.css";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success("Logged out successfully.");
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
        }
    };

    return (
        <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            Logout
        </button>
    );
};

export default LogoutButton;