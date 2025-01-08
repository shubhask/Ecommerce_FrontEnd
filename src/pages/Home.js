import { useEffect, useState } from 'react';
import { getAuthToken } from '../utill/Auth';
import axios from "axios";
import { json, Link } from "react-router-dom";
import { baseURL } from '../utill/appConfig';
import { fetchCartItemCount, setCartItemCount } from '../utill/CartSlice';
import { useDispatch } from 'react-redux';

function HomePage() {
  const token = getAuthToken();
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  };
  useEffect(() => {

    const fetchData = async () => {
      try{
        const response = await getCatogeries(token);
        setCategories(response);

      } catch(error){
        console.error('Error fetching categories: ', error);
      } 
    };
    fetchData();
  }, [token]);

  const fetchCartItemCount = async () => {
    try {
      const response = await axios.get(`${baseURL}/carts/cartItemCounts`, config);
      console.log("number of cart items " + response.data);
      dispatch(setCartItemCount(response.data));
    } catch (error) {
      console.error('Error fetching product\'s details for categories: ', error);
    }
  };
  
  useEffect(() => {
    fetchCartItemCount();
  }, []);
  
  async function getCatogeries(token){

    try{
        const response = await axios.get(`${baseURL}/catalog/categories`, token)
        
        // Handle a successful response here (e.g., show a success message)
        console.log('Categories are', response.data);
        
        if(response.status !== 200){
            throw json({message: 'could not get the categories'}, {status: 500});
        }
        return response.data.categories;
    } catch(error){
        let errorMessage = 'An error occurred while retrieving categories.';

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
        <h1 className="m-2">Shopping by Category</h1>
      </div>
      
      <div className="row">
        {categories && categories.map((category) => (
            <div key={category.alias} className="col-sm-2">
            <div><img src={category.imagePath} alt={category.name} width="80px" /></div>
            <div>
              <Link to={`/catalog/c/${category.alias}`}>{category.name}</Link>
            </div>			
            </div>
          ))} 
      </div>
    </div>
  );
}

export default HomePage;
