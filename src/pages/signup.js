import AuthForm from "@/components/AuthForm";
import Link from "next/link";

const SignupPage = () => {
    return (
        <div>
            <AuthForm isLogin={false} />
        </div>
    );
};

export default SignupPage;
