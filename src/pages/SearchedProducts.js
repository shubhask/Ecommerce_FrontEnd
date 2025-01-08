import { useEffect, useState } from 'react';
import axios from "axios";
import { json, Link, useParams } from "react-router-dom";
import { baseURL } from "../utill/appConfig";
import ProductByCategoryPrice from './ProductsByCategoryPrice';

export default function SearchedProducts() {

    const {keyword} = useParams();
    const [productsForCategory, setProductsForCategory] = useState({});
    
    useEffect(() => {
      console.log("Inside useEffect");
      const fetchProducts = async () => {
        try{
          const products = await getProducts(keyword);
          setProductsForCategory(products);
        } catch(error){
          console.error('Error fetching products for categories: ', error);
        }
      };
      fetchProducts();
    }, [keyword])

    async function getProducts(keyword){

      try{
          const response = await axios.get(`${baseURL}/catalog/search?keyword=${keyword}`);
          
          console.log('Searched Products are', response.data);
          
          if(response.status !== 200){
              throw json({message: 'could not get the products for keyword'}, {status: 500});
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
    }

  return (
    <div className="container-fluid">
      
      

      {productsForCategory.productList && <h2> Search results for {keyword}</h2>}

      {!productsForCategory.productList && <h3> No Match found for the {keyword}</h3>}

      <div className="row">
          {productsForCategory.productList && productsForCategory.productList.map((product) => {
            return (
              <div className="col-sm-2" key={product.alias}>
                <Link to={`/catalog/p/${product.alias}`}>
                    <img src={product.mainImagePath} width="200px" alt={product.name}/><br/>
                    <b>{product.name}</b>
                </Link>
                <ProductByCategoryPrice product={product} />
            </div>);
          })}
      </div>
    </div>
  );
}