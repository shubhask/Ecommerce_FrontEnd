import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";

export function getAuthToken(){
    const token = localStorage.getItem('token');
    //setTokenExpiryWatcher(token);
    return token;
}

// function setTokenExpiryWatcher(token) {
//     const decoded = jwtDecode(token);
//     const timeUntilExpiry = (decoded.exp * 1000) - Date.now();
  
//     setTimeout(() => {
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }, timeUntilExpiry);
// }

export function isTokenExpired(token){
    if(!token) return true;
    try{
        const decode = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log("decode.exp: " + decode.exp);
        console.log("currentTime: "+ currentTime);
        return decode.exp < currentTime;
    } catch(error){
        console.log("Error decoding jwt token: ", error);
        return true;
    }
}

export function getCustomerName(){
    const customer = localStorage.getItem('customer');
    return JSON.parse(customer);
}
export function setCustomerName(customer){
    localStorage.setItem('customer', customer);
    return;
}

export function tokenLoader(){
    return getAuthToken();
}

export function checkAuthLoader(){
    const token = getAuthToken();

    if(!token){
        return redirect('/login');
    }
    return null;
}
