import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !user) {
        navigate("/auth/login");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user, navigate]);

  const handleViewOrders = () => {
    if (isAuthenticated && user) {
      navigate("/shop/account");
    } else {
      sessionStorage.setItem("redirectAfterLogin", "/shop/account");
      navigate("/auth/login");
    }
  };


  return (
    <Card className="p-10 mt-20 w-full max-w-xl mx-auto text-center">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-4xl text-green-600">
          Payment Successful!
        </CardTitle>
      </CardHeader>
      <Button
        className="mt-5 bg-rose-800 hover:bg-rose-700 text-white"
        onClick={handleViewOrders}
      >
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
