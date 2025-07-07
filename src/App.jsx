import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
// import ProductList from './components/ProductList'
import Home from './Pages/Home'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Products from './Pages/Produsts'
import AboutUs from './Pages/AboutUs'
import Contact from './Pages/Contact'
import ProductDetails from './Pages/ProductDetails.jsx'
import CreateProduct from './Pages/CreateProduct,.jsx'
import Login from './Pages/Login.jsx'
import SignIn from './Pages/SignIn.jsx'
import CreateAccount from './Pages/CreateAccount.jsx'
import YourPurchases from './Pages/YourPurchases.jsx'
import YourSellProducts from './Pages/YourSellProducts.jsx'
import Checkout from './Pages/Checkout.jsx'
import TestConnection from './Pages/TestConnection.jsx'
import { initializeAuth } from './slices/authSlice'



const router = createBrowserRouter([
   {
    path: '/',
    element: <div><Home/></div>  
  },
  {
    path: '/singin',
    element: <div><Login/></div>  
  },
  {
    path: '/signin',
    element: <div><SignIn/></div>  
  },
  {
    path: '/signup',
    element: <div><CreateAccount/></div>  
  },
  {
    path: '/create-account',
    element: <div><CreateAccount/></div>  
  },
  

  {
    path: '/products',
    element: <div><Products/></div>  
  },
  {
    path: '/product/:id',
    element: <div><ProductDetails/></div>  
  },
  {
    path: '/aboutus',
    element: <div><AboutUs/></div>  
  },
  {
    path: '/contactus',
    element: <div><Contact/></div>  
  },
  {
    path: '/sell',
    element: <div><CreateProduct/></div>  
  },
  {
    path: '/your-purchases',
    element: <div><YourPurchases/></div>  
  },
  {
    path: '/your-sell-products',
    element: <div><YourSellProducts/></div>  
  },
  {
    path: '/checkout',
    element: <div><Checkout/></div>  
  },
  {
    path: '/test-connection',
    element: <div><TestConnection/></div>  
  },
])

function App() {
  
  const dispatch = useDispatch()

  // Initialize auth state when app loads
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return ( 
    <div className="bg-[#131921] text-white w-full min-h-screen">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
