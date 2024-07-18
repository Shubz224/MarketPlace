import { useState } from "react"
import ProductCard from "../Components/product-card";

const Search = () => {

const [search,setsearch] = useState("");
const [sort ,setSort] = useState("");
const [maxPrice ,SetMaxprice]= useState(100000);
const [Category,setCategory] = useState("");
const [page,setpage] =useState(1);

const addTocartHandler = ()=>{
//temporary handler
};

const isprevpage = page > 1;
const isNextpage = page< 4;

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(Low to High)</option>
            <option value="dsc">Price(High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input 
           type="range"
           min = {100}
           max = {100000}
          value={maxPrice}
           onChange={(e)=>SetMaxprice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select value={Category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="">Sample1</option>
            <option value="">Sample2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name...." 
        value={search}
        onChange={(e)=>setsearch(e.target.value)} />

        <div className="search-product-list">
        <ProductCard  
        photo="https://m.media-amazon.com/images/I/71xlzzUl6aL._AC_UL320_.jpg" 
        productId="dsadasd" 
         name="nike" 
          price={45454} 
          stock={43}
           handler={addTocartHandler}
        />
        </div>
        
      
 
        <article>
          <button   disabled= {!isprevpage} onClick={()=>setpage((prev)=>prev -1)}>Prev</button>
          <span>{page} of {4}</span>
          <button disabled= {!isNextpage} onClick={()=>setpage((prev)=>prev+1)}>Next</button>
        </article>



      </main>
      </div>
  )
}

export default Search