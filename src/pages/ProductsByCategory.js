import { useEffect, useState } from 'react';
import axios from "axios";
import { json, Link, useParams } from "react-router-dom";
import { baseURL } from "../utill/appConfig";
import Breadcrumb from "./Breadcrumb";
import ProductByCategoryPrice from './ProductsByCategoryPrice';

export default function ProductsByCategory() {

    const {categoryAlias} = useParams();
    const [productsForCategory, setProductsForCategory] = useState({});
    
    useEffect(() => {
      console.log("Inside useEffect");
      const fetchProducts = async () => {
        try{
          const products = await getProducts(categoryAlias);
          setProductsForCategory(products);
        } catch(error){
          console.error('Error fetching products for categories: ', error);
        }
      };
      fetchProducts();
    }, [categoryAlias])

    async function getProducts(categoryAlias){

      try{
          const response = await axios.get(`${baseURL}/catalog/c/${categoryAlias}`);
          
          // Handle a successful response here (e.g., show a success message)
          console.log('Products by categories are', response.data);
          
          if(response.status !== 200){
              throw json({message: 'could not get the products by category'}, {status: 500});
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
      
      <div>
      <h1 className="m-2">Products in Category</h1>
      </div>
      
      {productsForCategory && productsForCategory.categoryParents && <Breadcrumb productsDump={productsForCategory} />}

      <div className="row text-center">
        {productsForCategory && productsForCategory.category && productsForCategory.category.categories.map((category) => (
            <div className="col" key={category.alias}>
                <Link to={`/catalog/c/${category.alias}`}>
                    <img src={category.imagePath} height="100px" alt={category.name}/>
                    <br/>
                    <b>{category.name}</b>
                </Link>
            </div>
          ))}
      </div>

      <div className="row">
          {productsForCategory.productList && productsForCategory.productList.map((product) => {
            return (
              
              <div className="col-sm-2" key={product.alias}>
                <Link to={`/catalog/p/${product.alias}`}>
                    <img src={product.mainImagePath} width="200px" alt={product.name}/><br/>
                    <b>{product.name}</b>
                </Link>
                <ProductByCategoryPrice product={product} />
              </div>
            
            );
          })}
      </div>
      
        
      
    </div>
  );
}