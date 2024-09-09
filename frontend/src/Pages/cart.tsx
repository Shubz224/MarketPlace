import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../Components/cart-Item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartReducerInitialstate } from "../types/reducer-types";
import { cartItem } from "../types/types";
import {
  addToCart,
  calculatePrice,
  removeCartItem,
} from "../redux/reducer/cartReducer";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: cartReducerInitialstate }) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [CouponCode, setCouponCode] = useState<string>("");
  const [isvalidCouponCode, setisvalidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: cartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementtHandler = (cartItem: cartItem) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      if (Math.random() > 0.5) setisvalidCouponCode(true);
      else setisvalidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      setisvalidCouponCode(false);
    };
  }, [CouponCode]);

  //---------------------------------------------------------------------------------------------------------------------------------------------.

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementtHandler={decrementtHandler}
              removHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>

      <aside>
        <p>
          <p>Subtotal : ₹ {subtotal}</p>
          <p>ShippingCharges : ₹ {shippingCharges}</p>
          <p>Tax : ₹ {tax}</p>
          <p>
            Discount : <em className="red">- ₹{discount}</em>
          </p>
          <p>
            <b>Total : ₹ {total}</b>
          </p>
        </p>
        <input
          type="text"
          value={CouponCode}
          placeholder="Coupon Code"
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {CouponCode &&
          (isvalidCouponCode ? (
            <span className="green">
              {" "}
              ₹{discount} off using <code>{CouponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
