import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
};


//displaying products on front  page

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="productCard">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span> ₹{price}</span>
      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
