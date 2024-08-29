import { Link } from "react-router-dom";
import ProductCard from "../Components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../Components/loader";
import { cartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addTocartHandler = (cartitem: cartItem) => {
    if (cartitem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartitem));
  };

  if (isError) toast.error("Cannot fetch the Products");
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          {" "}
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              photo={i.photo}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addTocartHandler}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
