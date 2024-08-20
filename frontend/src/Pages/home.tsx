import { Link } from "react-router-dom";
import ProductCard from "../Components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../Components/loader";
const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addTocartHandler = () => {};

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
