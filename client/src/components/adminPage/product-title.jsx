import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] rounded-lg object-cover"
          />
        </div>
        <CardContent>
          <h2 className="text-lg font-bold mb-2 mt-2 text-rose-800">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-md font-semibold text-primary text-rose-800 ${
                product?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-md font-bold text-rose-800">${product?.salePrice}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            className="bg-rose-800 text-white hover:bg-rose-700"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button className='bg-rose-800 text-white hover:bg-rose-700' onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
