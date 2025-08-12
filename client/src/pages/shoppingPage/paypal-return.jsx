import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

    if (paymentId && payerId && orderId) {
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          navigate("/shop/payment-success");
        } else {
          navigate("/shop/checkout");
        }
      });
    } else {
      navigate("/shop/checkout");
    }
  }, [dispatch, paymentId, payerId, navigate]);

  return (
    <Card className="mt-20 w-full max-w-xl mx-auto text-center p-8">
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">
          Processing Payment... Please wait!
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
