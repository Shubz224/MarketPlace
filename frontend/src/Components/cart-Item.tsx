import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { server } from "../redux/store";
import { cartItem } from "../types/types";

type CartItemProps = {
  cartItem: cartItem;
  incrementHandler: (cartItem: cartItem) => void;
  decrementtHandler: (cartItem: cartItem) => void;
  removHandler: (id: string) => void;
};

const CartItem = ({ cartItem ,incrementHandler,decrementtHandler,removHandler}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹ {price}</span>
      </article>
      <div></div>
      <button onClick={()=>decrementtHandler(cartItem)}>-</button>
      <p>{quantity}</p>
      <button onClick={()=>incrementHandler(cartItem)}> +</button>

      <button onClick={()=>removHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
