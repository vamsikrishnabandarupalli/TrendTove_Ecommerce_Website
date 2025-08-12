import React, { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dilogbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/seperator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = { status: "" };

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleUpdateStatus = (e) => {
    e.preventDefault();

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: formData.status })
    ).then((response) => {
      if (response?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({ title: response.payload.message });
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6 mt-6">
        <div className="grid gap-2">
          {[ 
            { label: "Order ID", value: orderDetails?._id },
            { label: "Order Date", value: orderDetails?.orderDate?.split("T")[0] },
            { label: "Order Price", value: `$${orderDetails?.totalAmount}` },
            { label: "Payment method", value: orderDetails?.paymentMethod },
            { label: "Payment Status", value: orderDetails?.paymentStatus },
          ].map(({ label, value }) => (
            <div key={label} className="flex mt-2 items-center justify-between">
              <p className="font-medium">{label}</p>
              <Label>{value}</Label>
            </div>
          ))}

          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-900 text-white"
                    : "bg-rose-800 hover:bg-rose-700 text-white "
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.length > 0 &&
                orderDetails.cartItems.map(({ title, quantity, price }, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>Title: {title}</span>
                    <span>Quantity: {quantity}</span>
                    <span>Price: ${price}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;
