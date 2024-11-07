// src/pages/auth/login.js
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

const LoginPage = () => {
    return (
        <div>
            <AuthForm isLogin={true} />
        </div>
    );
};

export default LoginPage;
