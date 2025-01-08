import axios from 'axios';
import React from 'react';
import { json } from 'react-router-dom';
import { baseURL } from '../utill/appConfig';
import { getAuthToken } from '../utill/Auth';
export default function ShoppingCartQuantityControl({ product, quantity, onQuantityChange, showErrorModal }) {

    const token = getAuthToken();

    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      };
    

    const handleIncrement = () => {
        
        const newQuantity = quantity + 1;
        if(newQuantity > 5){
            showErrorModal("Could not add more item(s) "
						+ "because there's already "+ quantity + " item(s)"
						+ " in your shopping cart. Maximum allowed quantity is 5");
            return;
        }
        addToCart('increase', newQuantity);
        onQuantityChange('increase', product.discountPrice);
    };

    const handleDecrement = () => {
        const newQuantity = quantity - 1;
        if(newQuantity < 1){
            showErrorModal("minimum quatity is 1");
            return;
        }
        addToCart('decrease', newQuantity);
        onQuantityChange('decrease', product.discountPrice);
    };

    
    const addToCart = async (operation, quantiToUpdate) => {
        
            if(operation === 'increase'){
                try{
                    const response = await axios
                    .post(`${baseURL}/carts/cart/add/${product.id}/1`,{}, config)
                    
                    if(response.status !== 200){
                        throw json({message: 'could not Add product to the cart'}, {status: 500});
                    }
                    return "updated cart";
                } catch(error){
                    let errorMessage = 'An error occurred during adding product to the cart.';
                    return errorMessage;
                }
            } else{
                if(operation === 'decrease'){
                    try{
                        if(quantiToUpdate >=1){
                            const response = await axios
                            .post(`${baseURL}/carts/cart/update/${product.id}/${quantiToUpdate}`,{}, config)
                            
                            if(response.status !== 200){
                                throw json({message: 'could not update product to the cart'}, {status: 500});
                            }

                            return "updated cart";
                        }
                    } catch(error){
                        let errorMessage = 'An error occurred during adding product to the cart.';
                        return errorMessage;
                    }
                }
            }
    };
    return (
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <button className="page-link linkMinus" onClick={handleDecrement}><b>-</b></button>
                </li>
                <li className="page-item">
                    <input
                        type="text"
                        className="form-control text-center"
                        id={`quantity${product.id}`}
                        style={{ width: "50px", margin: "0 auto" }}
                        value={quantity}
                        readOnly
                    />
                </li>
                <li className="page-item">
                    <button className="page-link linkPlus" onClick={handleIncrement}><b>+</b></button>
                </li>
            </ul>
        </nav>
    );
}