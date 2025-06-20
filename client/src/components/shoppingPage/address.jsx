/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "../../store/shop/address-slice";
import AddressCard from "./addressCard";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  const isFormValid = () =>
    Object.values(formData).every((value) => value.trim() !== "");

  const refreshAddresses = () => dispatch(fetchAllAddresses(user?.id));

  useEffect(() => {
    if (user?.id) {
      refreshAddresses();
    }
  }, [dispatch, user?.id]);

  const handleManageAddress = (event) => {
    event.preventDefault();

    if (!currentEditedId && addressList.length >= 3) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    if (currentEditedId) {
      dispatch(
        editAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then(({ payload }) => {
        if (payload?.success) {
          refreshAddresses();
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast({ title: "Address updated successfully" });
        }
      });
    } else {
      dispatch(addNewAddress({ ...formData, userId: user?.id })).then(
        ({ payload }) => {
          if (payload?.success) {
            refreshAddresses();
            setFormData(initialAddressFormData);
            toast({ title: "Address added successfully" });
          }
        }
      );
    }
  };

  const handleDeleteAddress = (address) => {
    dispatch(deleteAddress({ userId: user?.id, addressId: address._id })).then(
      ({ payload }) => {
        if (payload?.success) {
          refreshAddresses();
          toast({ title: "Address deleted successfully" });
        }
      }
    );
  };

  const handleEditAddress = (address) => {
    setCurrentEditedId(address._id);
    setFormData({
      address: address.address,
      city: address.city,
      phone: address.phone,
      pincode: address.pincode,
      notes: address.notes,
    });
  };

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList?.map((address) => (
          <AddressCard
            key={address._id}
            selectedId={selectedId}
            handleDeleteAddress={handleDeleteAddress}
            addressInfo={address}
            handleEditAddress={handleEditAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        ))}
      </div>
      <CardHeader>
        <CardTitle>{currentEditedId ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
