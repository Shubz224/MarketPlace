import { useEffect, useState } from 'react'
import { VscError } from 'react-icons/vsc';
import CartItem from '../Components/cart-Item';
import { Link } from 'react-router-dom';

const cartItems = [
  {
    productId :"sssfssf",
    photo : "https://m.media-amazon.com/images/I/71xlzzUl6aL._AC_UL320_.jpg",
     name: "Nike",
     price :3000,
     quantity :4,
     stock:10,
  }
];
const Subtotal = 4000;
const tax = Math.round(Subtotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = Subtotal + tax + shippingCharges;

const Cart = () => {

  const [CouponCode, setCouponCode] = useState<string>("");
  const [isvalidCouponCode, setisvalidCouponCode] = useState<boolean>(false);

    useEffect (()=>{

      const timeOutID = setTimeout (()=>{
               if(Math.random()>0.5)setisvalidCouponCode(true);
               else setisvalidCouponCode(false);
      },1000);

       return ()=>{
            clearTimeout(timeOutID);
            setisvalidCouponCode(false);
       }
    }, [CouponCode])




  return (
    <div className='cart'>
      <main>
{cartItems.length > 0  ? (cartItems.map((i,idx)=>(<CartItem  
      key={idx}
      cartItem = {i}
    />)) ) : (<h1>No Items Added</h1>)
    }
    

      </main>

      <aside>
        <p>
          <p>Subtotal : ₹ {Subtotal}</p>
          <p>ShippingCharges : ₹ {shippingCharges}</p>
          <p>Tax : ₹ {tax}</p>
          <p>
            Discount :  <em className='red' >-  ₹{discount}
            </em>
          </p>
          <p><b>Total : ₹ {total}</b></p>
        </p>
        <input type="text"
          value={CouponCode}
          placeholder='Coupon Code'
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {
          CouponCode && (
            isvalidCouponCode ?
              (<span className='green'> ₹{discount} off using <code>{CouponCode}</code></span>)
              :
              (<span className='red'>Invalid Coupon <VscError /></span>)
          )


        }

      {
        cartItems.length > 0 && <Link to = "/shipping">
        Checkout
        </Link>
      }



      </aside>
    </div>
  )
}

export default Cart;