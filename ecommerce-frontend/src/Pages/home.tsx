
import { Link } from "react-router-dom"
import ProductCard from "../Components/product-card";
const Home = () => {

//temporary handler 

const addTocartHandler =()=>{

}
  return (
    <div className="home">
    <section></section>

    <h1>
     Latest Products
     <Link to = "/search" className="findmore"> More</Link>
    </h1>
    <main>
    <ProductCard  photo="https://m.media-amazon.com/images/I/71xlzzUl6aL._AC_UL320_.jpg" productId="dsadasd"  name="nike"  price={45454} stock={43} handler={addTocartHandler}/>
    </main>
</div>
  );
};

export default Home;