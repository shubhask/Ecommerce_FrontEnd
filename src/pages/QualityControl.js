import React from 'react';
export default function QuantityControl({ product, quantity, onQuantityChange }) {
    const handleIncrement = () => {
        if(quantity < 5){
          const newQuantity = quantity + 1;
          onQuantityChange(newQuantity);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            onQuantityChange(newQuantity);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" } }>
          {/* Decrement Button */}
          <button
            className="btn btn-outline-primary"
            onClick={handleDecrement}
            style={{ width: "40px", height: "40px" }}
          >
            <b>-</b>
          </button>
      
          {/* Quantity Input */}
          <input
            type="text"
            className="form-control text-center"
            id={`quantity${product.id}`}
            style={{ width: "60px" }}
            value={quantity}
            readOnly
          />
      
          {/* Increment Button */}
          <button
            className="btn btn-outline-primary"
            onClick={handleIncrement}
            style={{ width: "40px", height: "40px" }}
          >
            <b>+</b>
          </button>
        </div>
      );
}