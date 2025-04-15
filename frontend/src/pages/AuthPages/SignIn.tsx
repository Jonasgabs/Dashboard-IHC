import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login - Leading Prospect core"
        description="Leading Prospect core - Flavia Golveia"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
