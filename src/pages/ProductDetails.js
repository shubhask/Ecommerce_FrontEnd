import axios from "axios";
import { useEffect, useState } from "react";
import { json, useParams } from "react-router-dom";
import { baseURL } from "../utill/appConfig";
import { getAuthToken } from "../utill/Auth";
import Breadcrumb from "./Breadcrumb";
import StarRatings from 'react-star-ratings';
import ProductReview from "./ProductReviews";
import QuantityControl from "./QualityControl";
import AddtoCartModal from "./AddToCartModal";
import { useDispatch } from "react-redux";
import { incrementCartItemCount } from "../utill/CartSlice";
import ProductPrice from "./ProductPrice";


function ProductDetails() {
  const {productAlias} = useParams();
  const [productDetailsByAlias, setProductDetailsByAlias] = useState([]);
  const product = productDetailsByAlias.product;
  const token = getAuthToken();
  const [quantity, setQuantity] = useState(1);
  const [showAddtoCartModal, setShowAddtoCartModal] = useState(false);
  const [modalBody, setModalBody] = useState('');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  };
  const dispatch = useDispatch();


  const handleQuantityChange = (newQuantity) => {
      setQuantity(newQuantity);
  };

  const closeHandler= () => {
    setShowAddtoCartModal(false);
  }

  const handleAddToCart = async () => {
    try{
        const response = await axios
        .post(`${baseURL}/carts/cart/add/${product.id}/${quantity}`,{}, config)
        
        
        if(response.status !== 200){
            throw json({message: 'could not Add product to the cart'}, {status: 500});
        }
        const data =response.data;

        if (!data.includes('Could not add')) {
          dispatch(incrementCartItemCount(quantity));
        }
        setModalBody(data);
        setShowAddtoCartModal(true);
    } catch(error){
        let errorMessage = 'An error occurred during adding product to the cart.';
        return errorMessage;
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try{
        const response = await getProductDetailsByAlias(productAlias);
        setProductDetailsByAlias(response);
      } catch(error){
        console.error('Error fetching product\'s details for categories: ', error);
      }
    };
    fetchProductDetails();
  },[productAlias]);

  // const fetchCartItemCount = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/carts/cartItemCounts`, config);
  //     console.log("number of cart items " + response.data);
  //     setCartItemCount(response.data);
  //   } catch (error) {
  //     console.error('Error fetching product\'s details for categories: ', error);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchCartItemCount();
  // }, []);

  const getProductDetailsByAlias = async () => {

    try{

      const response = await axios.get(`${baseURL}/catalog/p/${productAlias}`, config);
      
      // Handle a successful response here (e.g., show a success message)
      console.log('Product details are', response.data);
      
      if(response.status !== 200){
          throw json({message: 'could not get the products'}, {status: 500});
      }
      return response.data;
      } catch(error){
          let errorMessage = 'An error occurred while retrieving products by category.';

          if (error.response && error.response.status === 401) {
              errorMessage = 'Bad credentials. Please try again.';
          } else {
              errorMessage = 'Unknown error. Please try again later.';
          }

          console.log(errorMessage);
          return errorMessage;
      }
  };

  return (
    <>

      {showAddtoCartModal && <AddtoCartModal modalBody={modalBody} modalTitle="Warning" onClose={closeHandler}/>}

      {/* {token && <SearchNavBar token={token} cartItemCounts={cartItemCounts} />} */}
      <div className="container-fluid">
        <div>
          <h1 className="m-2">Products in Category</h1>
        </div>
        
        {product && <Breadcrumb productsDump={productDetailsByAlias}/>}
        {product && 
          <div>
            <div className="row">
            <div className="col-sm">
              <div>
                <img id="bigImage" src={product.mainImagePath} className="img-fluid" index="0" alt={product.name} />
              </div>
              <div className="d-flex justify-content-center">
                <div className="m-2 border border-secondary">
                  <img className="imageThumbnail" src={product.mainImagePath} alt={product.name} height="50" index="0"/>
                </div>
                {product.images.map((extraImage, status) => {
                  return (
                    <div className="m-2 border border-secondary">
                      <img className="imageThumbnail" src={extraImage.imagePath} alt={extraImage.name} height="50" 
                      index={status} />
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="col-sm">
              <div>
                <h2>{product.name}</h2>
              </div>
              <div className="row">
                <div className="col-xs">
                {product && product.averageRating > 0 && <StarRatings
                    rating={product.averageRating}
                    starRatedColor="yellow"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px" />}
                </div>
                <div class="col-xs ml-1 mt-3">
                  <a href='#review'>{product.reviewCount} rating(s)</a>
                </div>
              </div>
              <div>
                <span>Brand: {product.brand.name}</span>
              </div>
              <div><ProductPrice product={product} /></div>
              <div>&nbsp;</div>
              <div dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
            </div>
            
            <div class="col-sm-2">
              <div className="mb-3">
                  {product.inStock && <span className="text-success"><b>In Stock</b></span>}
                  {!product.inStock && <span className="text-danger"><b>Out of Stock</b></span>}
              </div>

              {product.inStock && <div>
                <div className="mb-3">
                  <QuantityControl product={product} quantity={quantity} onQuantityChange={handleQuantityChange} />
                </div>
                <div class="mt-3">
                  <input type="button" className="btn btn-primary" id="buttonAdd2Cart" value="Add to Cart" onClick={handleAddToCart} />
                </div>
              </div>}
            </div>
          </div>
          
          <div class="row">
            <div class="col-12">
              <div><hr/></div>
              <div>
                <h3>Product Description:</h3>
              </div>			
              <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
            </div>
          </div>
          
          <div class="row">
            <div class="col-12">
              <div><hr/></div>
                <div>
                  <h3>Product Details:</h3>
                </div>
                {product.details.map((detail) => {
                  return (
                    <div>
                      <b>{detail.name}</b>
                      <span>{detail.value}</span>
                    </div>
                  );
                })}
              
            </div>
          </div>
        </div>
        }
        {product && <ProductReview productsDump={productDetailsByAlias} />}
    </div>
    </>
    );
}

export default ProductDetails;
