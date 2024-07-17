
import { Link } from "react-router-dom"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { useState } from "react";

const user = { _id: "1223", role: "" };

const Header = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);


  //handle logout function
  const logoutHandler = ()=>{
    setIsOpen(false);
  }


  return (

    <nav className="header">
      <Link  onClick={()=>setIsOpen(false)} to={"/"}>HOME</Link>
      <Link onClick={()=>setIsOpen(false)} to={"/search"}><FaSearch /></Link>

      <Link onClick={()=>setIsOpen(false)  } to={"/cart"}><FaShoppingBag /></Link>
      {
        user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen}>
              <div>
                {
                  user.role === "admin" && (
                    <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>

                  )
                }

                <Link  onClick={()=>setIsOpen(false)} to="/orders">Orders</Link>
                <button  onClick={ logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : <Link   onClick={()=>setIsOpen(false)}   
         to={"/login"}><FaSignInAlt />
         </Link>
      }
    </nav>
  )
}

export default Header;