import CommonForm from "../../components/common/form";
import { useToast } from "../../components/ui/use-toast";
import { loginFormControls } from "../../config";
import { loginUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data.payload.message });
      } else {
        toast({ title: data.payload.message, variant: "destructive" });
      }
    });
  }

  // ⏭ Redirect after login
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(user?.role === "admin" ? "/admin/dashboard" : "/shop/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="mt-2 text-center">
        Don't have an account?
        <Link
          to="/auth/register"
          className="font-medium ml-2 text-primary hover:text-rose-500"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
