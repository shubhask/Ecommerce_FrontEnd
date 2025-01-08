import React from 'react';

const PriceFragment = ({ price }) => {
  return <span>${price.toFixed(2)}</span>; // Format the price to 2 decimal places
};

const ProductPrice = ({ product }) => {
  const formatDecimal = (number, digits = 1) => {
    return number.toFixed(digits);
  };

  return (
    <div>
      <div>
        List Price:
        {product.discountPercent <= 0 ? (
           <PriceFragment price={product.price} />
        ) : (
          <del>
            <PriceFragment price={product.price} />
          </del>
        )}
      </div>

      {product.discountPercent > 0 && (
        <div>
          Price:
          <span style={{ fontSize: 'larger', color: 'darkred' }}>
            <PriceFragment price={product.discountPrice} />
          </span>
          ({formatDecimal(product.discountPercent, 1)}% off)
        </div>
      )}
    </div>
  );
};

export default ProductPrice;