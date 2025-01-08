import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { baseURL } from '../utill/appConfig';
import { getAuthToken } from '../utill/Auth';
import { setCartItemCount } from '../utill/CartSlice';

const CheckoutPage = () => {
    const token = getAuthToken();
    const [checkoutDetails, setCheckoutDetails] = useState([]);
    const {shippingAddress, checkoutInfo, cartItems} = checkoutDetails;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      };


  const fetchCheckoutDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/carts/checkout`, config);
      setCheckoutDetails(response.data);
    } catch (error) {
      console.error('Error fetching checkout details : ', error);
    }
  };
  
  useEffect(() => {
    fetchCheckoutDetails();
  }, []);


  const handleCODSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get(`${baseURL}/carts/place_order`, config);
        if(response.data.id){
          dispatch(setCartItemCount(0));
            navigate('/orderedSuccessfully');
          }
      } catch (error) {
        console.error('Error placing order : ', error);
      }
      
    // Handle Cash on Delivery submission
    // You can add the logic here to place the order with COD
  };

  return (
    <div className="container-fluid">
      {/* Include the necessary React components for the header and search-nav */}
      {/* Replace the following with your React components */}
      <div className="text-center">
        <h1>Your Checkout</h1>
      </div>

      {checkoutInfo && <div className="row m-1">
        <div className="col-sm-8">
          {/* Shipping Information Card */}
          <div className="card">
            <div className="card-header"><h5>Shipping information</h5></div>
            <div className="card-body">
              <p>
                <b>Ship to:</b>&nbsp; {shippingAddress}
                <Link href="/address_book(redirect=checkout)">[Ship to another address]</Link>
              </p>
              <p>
                <b>Days to deliver: </b>&nbsp; {checkoutInfo.deliveryDays} day(s)
              </p>
              <p>
                <b>Expected delivery Date: </b> {checkoutInfo.deliveryDate}
              </p>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card">
            <div className="card-header"><h5>Payment Method</h5></div>
            <div className="card-body">
              {checkoutInfo.codSupported && (
                <form onSubmit={handleCODSubmit}>
                  <p>
                    <input type="radio" name="paymentMethod" id="radioCOD" value="COD" /> Cash on Delivery (COD)
                    &nbsp;
                    <button type="submit" className="btn btn-primary">Place order with COD</button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
    <div className="col-sm-4">
        <div className="card">
            <div className="card-header"><h5>Order Summary</h5></div>
            <div className="card-body">
            <div>
                <table>
                {cartItems.map((item, index) => (
                    <React.Fragment key={index}>
                    <tr>
                        <td>{item.quantity} X &nbsp;&nbsp;</td>
                        <td width="60%">
                        <Link to={`/catalog/p/${item.productResponse.alias}`} target="_blank" rel="noopener noreferrer">
                            {item.productResponse.shortName}
                        </Link>
                        <br/>
                        <small>Ship: {item.shippingCost}</small>
                        </td>
                        <td>
                        {item.subTotal}
                        </td>
                    </tr>
                    </React.Fragment>
                ))}
                <tr><td colSpan="3"><hr/></td></tr>
                </table>
            </div>
            <div className="row mt-2">
                <div className="col">Product Total</div>
                <div className="col">{checkoutInfo.productTotal}</div>
            </div>

            <div className="row mt-2">
                <div className="col">Shipping Cost Total</div>
                <div className="col">{checkoutInfo.shippingCostTotal}</div>
            </div>

            <div className="row mt-2">
                <div className="col">Payment Total</div>
                <div className="col"><b>{checkoutInfo.paymentTotal}</b></div>
            </div>
            </div>
        </div>
      </div>

      {/* Include the necessary React component for the footer menu */}
    </div>}
  </div>
  );
};

export default CheckoutPage;