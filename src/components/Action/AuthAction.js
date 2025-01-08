import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { json, redirect } from "react-router-dom";
import { baseURL } from "../../utill/appConfig";

export async function AuthAction({request}) {
    const data = await request.formData();

    const authData = {
        username : data.get('email'),
        password: data.get('password'),
    };
    const config = {
        headers: {
          'Content-Type': 'application/json'
        },
      };

    try{
        const response = await axios
        .post(`${baseURL}/auth`, JSON.stringify(authData), config)
        
        if(!response.data.jwtToken) return response;


        // Handle a successful response here (e.g., show a success message)
        console.log('Login successfully:', response.data);
        localStorage.setItem('token', response.data.jwtToken);

        const decoded = jwtDecode(response.data.jwtToken);
        const timeUntilExpiry = (decoded.exp * 1000) - Date.now();

        setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }, timeUntilExpiry);
        
        if(response.status !== 200){
            throw json({message: 'could not authenticate user'}, {status: 500});
        }

        const customerResponse = await axios.get(`${baseURL}/customers/username/`+authData.username, config);
        localStorage.setItem('customer', JSON.stringify(customerResponse.data));
        // const redirectPath = localStorage.getItem('redirectPath') || '/';
        // localStorage.removeItem('redirectPath'); // Clean up

        return redirect("/");
    } catch(error){
        let errorMessage = 'An error occurred during the login process. Please try again.';

        if (error.response && error.response.status === 401) {
            errorMessage = 'Bad credentials. Please try again.';
        } else if (error.response && error.response.status === 404) {
            errorMessage = 'No user found with email Id: ' + authData.username;
        } else if (error.response && error.response.status === 500) {
            errorMessage = 'Could not authenticate user. Please try again.';
        } else {
            errorMessage = 'Unknown error. Please try again later.';
        }

        return errorMessage;
    }
}

export function logoutAction(){
    localStorage.removeItem('token');
    return redirect('/login');
}