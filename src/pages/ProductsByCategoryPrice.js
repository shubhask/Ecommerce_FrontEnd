import React from 'react';

const PriceFragment = ({ price }) => {
  return <span>{price.toFixed(2)}₹</span>; // Format the price to 2 decimal places
};

const ProductByCategoryPrice = ({ product }) => {
   return (
    <div>
      <div>
        {product.discountPercent <= 0 &&
            <PriceFragment price={product.price} />
         }
      </div>

      {product.discountPercent > 0 && (
        <div>
          <span style={{ fontSize: 'larger', color: 'darkred' }}>
            <PriceFragment price={product.discountPrice} />
          </span>
          <del>
            <PriceFragment price={product.price} />
          </del>
        </div>
      )}
    </div>
  );
};

export default ProductByCategoryPrice;