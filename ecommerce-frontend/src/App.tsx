
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {Suspense, lazy} from 'react'
import Loader from './Components/loader';
const  Cart = lazy(()=>import('./Pages/cart')) ;
const  Home = lazy(()=>import('./Pages/home')) 
const  Search = lazy(()=>import('./Pages/search'));

const App = () => {
  return (
    <Router>
      {/*Header */}
       <Suspense fallback ={<Loader/>}>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
      </Routes>
       </Suspense>
    </Router>
  )
}
export default App;