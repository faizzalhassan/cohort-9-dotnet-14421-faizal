import { Toaster } from "react-hot-toast";

const ToastConfig = () => {
    return (
        <Toaster
            position="bottom-center"
            gutter={10}
            toastOptions={{
                duration: 3500,
                style: {
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: "13.5px",
                    fontWeight: "500",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                    maxWidth: "360px",
                    color: "#0F172A",
                    background: "#fff",
                    border: "1px solid #F1F5F9",
                },
                success: {
                    iconTheme: {
                        primary: "#22C55E",
                        secondary: "#fff",
                    },
                    style: {
                        background: "#fff",
                        border: "1px solid #DCFCE7",
                        color: "#15803D",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#EF4444",
                        secondary: "#fff",
                    },
                    style: {
                        background: "#fff",
                        border: "1px solid #FEE2E2",
                        color: "#DC2626",
                    },
                },
            }}
        />
    );
};

export default ToastConfig;