import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../utill/appConfig";
import { getAuthToken, isTokenExpired } from "../utill/Auth";
import { setCartItemCount } from "../utill/CartSlice";
import AddtoCartModal from "./AddToCartModal";
import ShoppingCartQuantityControl from "./ShoppingcartQuantityControl";
import '@fortawesome/fontawesome-free/css/all.min.css';




export default function Cart(){

    const token = getAuthToken();
    const [cartDetails, setCartDetails] = useState([]);
    const [cartEstimatedTotal, setCartEstimatedTotal] = useState(0);
    const {cartItemCount, cartItems, estimatedTotal, usePrimaryAddressAsDefault, shippingSupported} = cartDetails;
    const [showAddtoCartModal, setShowAddtoCartModal] = useState(false);
    const [modalBody, setModalBody] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      };
    
    const handleQuantityChange = (operation, price) => {
       if(operation === 'increase'){
        setCartEstimatedTotal(estimatedTotal + price);
        return;
       }else{
        setCartEstimatedTotal(estimatedTotal - price);
        return;
       }
    };

    const deleteHandler = async (item) => {
        try{
            const response = await axios.delete(`${baseURL}/carts/cart/delete/${item.productId}`, config);
            setModalBody(response.data);
            setShowAddtoCartModal(true);
            setCartEstimatedTotal(estimatedTotal - item.subTotal);
        } catch (error) {
          console.error('Error fetching product\'s details for categories: ', error);
        }
    }

    const handleShowErrorModal = (error) => {
        setModalBody(error);
        setShowAddtoCartModal(true);
    }

    const closeHandler= () => {
        setShowAddtoCartModal(false);
    }

    const fetchCartDetails = async () => {
        try {
            if (token && isTokenExpired(token)) {
                localStorage.removeItem('token');
                navigate('/login');
            }
          const response = await axios.get(`${baseURL}/carts`, config);
          setCartDetails(response.data);
          setCartEstimatedTotal(response.data.estimatedTotal);
          dispatch(setCartItemCount(response.data.cartItemCount));
        } catch (error) {
          console.error('Error fetching product\'s details for categories: ', error);
        }
      };
      
      useEffect(() => {
        fetchCartDetails();
      }, [cartEstimatedTotal]);

    return (
        <div class="container-fluid">
            {showAddtoCartModal && <AddtoCartModal modalBody={modalBody} modalTitle="Warning" onClose={closeHandler}/>}

            {/* {token && <SearchNavBar token={token} cartItemCounts={cartItemCount} />} */}
            
            <div class="text-center m-2">
                <h1>Your Shopping Cart</h1>
            </div>
            
            <div className="row m-1">
                <div className="col-sm-8">
                    {cartItems && cartItems.map((item, index) => {
                    const product = item.productResponse;

                    return (
                        <div key={index} className="row border rounded p-1" id={`row${index + 1}`}>
                            <div className="col-1">
                                <b><div className="divCount">{index + 1}</div></b>
                            </div>

                            <div className="col-3">
                                <img src={product.mainImagePath} className="img-fluid" alt="" />
                            </div>

                            <div className="col-6">
                                <Link to={`/catalog/p/${product.alias}`}>
                                    <b>{product.shortName}</b>
                                </Link>

                                {/* Include your quantity control component here */}
                                {/* Example: <QuantityControl quantity={item.quantity} productId={product.id} /> */}
                                {product && <ShoppingCartQuantityControl product={product} quantity={item.quantity} onQuantityChange={handleQuantityChange} showErrorModal={handleShowErrorModal}/>}
                                <div>
                                

                                {product.discountPercent <= 0 ? (
                                    <div><span>X&nbsp; ₹${product.price.toFixed(2)}</span></div>
                                    ) : (
                                        <div>
                                            <span style={{ fontSize: 'larger', color: 'darkred' }}>
                                                <div>
                                                    <span>X&nbsp; ₹${product.discountPrice.toFixed(2)}&nbsp;</span>
                                                    <del><span>₹${product.price.toFixed(2)}</span></del>
                                                </div>
                                            </span>
                                            
                                        </div>
                                    )}
                                </div>

                                <div>
                                <span>=&nbsp; <b>₹{item.subTotal.toFixed(2)}</b></span>
                                {/* Include your subtotal component here */}
                                {/* Example: <Subtotal value={item.subTotal} /> */}
                                </div>
                            </div>
                            
                            <div className="col-2">
                                <button onClick={() =>deleteHandler(item)}>
                                    <i class="fa-sharp fa-solid fa-trash"></i>
                                </button>
                            </div>
                            
                        </div>
                    );
                    })}
                    {cartItems && <div className="row m-1" id={`blankLine${cartItems.length}`}>&nbsp;</div>}
                </div>

                <div className="col-sm-4" id="sectionTotal">
                    {!cartItems && (
                    <div>
                        <span className="h3">Estimated total:</span>
                    </div>
                    )}
                    {cartItems && (
                    <div>
                        <span className="h3">Estimated total:</span>
                        <div className="mt-2">
                        <span id="total" className="h2">
                            {cartEstimatedTotal.toFixed(2)}
                        </span>
                        </div>
                        <div>
                        {shippingSupported ? (
                            <Link to="/checkout" class="btn btn-danger p-3 mt-2">
                                Check Out
                            </Link>
                        ) : (
                            <div>
                            <span className="h5 text-warning">No Shipping available for your location</span>
                            {usePrimaryAddressAsDefault ? (
                                <Link to="/account_details" className="h5">
                                Update your address
                                </Link>
                            ) : (
                                <Link to="/address_book" className="h5">
                                Use another shipping address
                                </Link>
                            )}
                            </div>
                        )}
                        </div>
                    </div>
                    )}
                </div>
            </div>
            
            {!cartItemCount && <h3>You have not chosen any product yet.</h3> }
        </div>
    );
}