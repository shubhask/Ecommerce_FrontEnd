import {
  createBrowserRouter,
  // createRoutesFromElements,
  RouterProvider,
  // Route,
} from 'react-router-dom';
import { AuthAction, logoutAction } from './components/Action/AuthAction';
import RegistrationForm from './components/Registration';
import RegistrationSuccess from './components/RegistrationSuccess';
import AccountDetails from './pages/AccountDetails';
import AddressBook from './pages/AddressBook';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import Login from './pages/Login';
import OrderSuccessfull from './pages/OrderSuccessfull';
import ProductDetails from './pages/ProductDetails';
import ProductsByCategory from './pages/ProductsByCategory';
import Reviews from './pages/Review';
import RootLayout from './pages/Root';
import SearchedProducts from './pages/SearchedProducts';
import WriteReview from './pages/WriteReview';
import { tokenLoader } from './utill/Auth';
import OrderPage from './pages/OrderPage';
import { Provider } from 'react-redux';
import store from "./utill/store"
import AddreesForm from './pages/AddressForm';
import AddreesSuccess from "./pages/AddreesSuccess"

// const routeDefinitions = createRoutesFromElements(
//   <Route>
//     <Route path="/" element={<HomePage />} />
//     <Route path="/products" element={<ProductsPage />} />
//   </Route>
// );

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
    children: [
      { index : true, element: <HomePage /> },
      { path: '/catalog/c/:categoryAlias', element: <ProductsByCategory />},
      { path: '/catalog/p/:productAlias', element: <ProductDetails /> },
      { path: '/write_review/product/:productId', element: <WriteReview />},
      { path: '/registration', element:<RegistrationForm /> },
      { path: '/account_details', element:<AccountDetails /> },
      { path: '/address_book', element:<AddressBook /> },
      { path: '/address_form', element:<AddreesForm /> },
      { path: '/address_success', element:<AddreesSuccess /> },
      { path: '/reviews', element:<Reviews /> },
      { path: '/orders', element:<OrderPage /> },
      { path: '/orders/page/:pageNum', element: <OrderPage /> },
      { path: '/orderedSuccessfully', element:<OrderSuccessfull /> },
      { path: '/carts', element:<Cart /> },
      { path: '/checkout', element:<Checkout /> },
      { path: '/register-success', element: <RegistrationSuccess /> },
      { path: '/login', element: <Login />, action: AuthAction },
      { path: '/search/:keyword', element: <SearchedProducts /> },
      {
        path: 'logout', action: logoutAction  
      }
    ],
  }
]);

// const router = createBrowserRouter(routeDefinitions);

function App() {
  return (
    <Provider store={store}> {/* Wrap your RouterProvider with Provider */}
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
