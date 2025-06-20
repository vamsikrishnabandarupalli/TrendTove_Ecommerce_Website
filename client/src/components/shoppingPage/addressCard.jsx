import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;
  const handleCardClick = setCurrentSelectedAddress
    ? () => setCurrentSelectedAddress(addressInfo)
    : undefined;

  return (
    <Card
      onClick={handleCardClick}
      className={`cursor-pointer ${isSelected ? "border-red-900 border-[4px]" : "border-black"} border-red-700`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button className='bg-rose-800 text-white hover:bg-rose-700' onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button className='bg-rose-800 text-white hover:bg-rose-700' onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
