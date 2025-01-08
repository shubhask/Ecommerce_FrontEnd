import React, {useState, useEffect} from "react";
import axios from "axios";
import "./OrdersPage.css";
import { baseURL } from "../utill/appConfig";
import { getAuthToken, isTokenExpired } from "../utill/Auth";
import SearchNavBar from "../UI/SearchNavBar";
import { useLocation, useNavigate } from "react-router-dom";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const token = getAuthToken();
    const [keyword, setKeyword] = useState('');
    const location = useLocation();
    const navigate  = useNavigate();   
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      };

      const fetchOrders = async (pageNum = 1) => {
        console.log("token value: "+ token);
        console.log("Is token expired: "+ isTokenExpired(token));
        
        if (token && isTokenExpired(token)) {
            localStorage.removeItem('token');
            // const currentPath = window.location.pathname; // Save current page
            // localStorage.setItem('redirectPath', currentPath); // Save for post-login redirection
            navigate('/login');
        }
        setIsLoading(true);
        try{

            const response = await axios.get(`${baseURL}/orders/page/${pageNum}`, config);
            console.log("Orders fetched:", response.data);

            setOrders(response.data.orderList);
            setCurrentPage(pageNum);
            setTotalPage(response.data.totalPage);
        } catch(error){
            console.error("Failed to fetch orders: ", error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleOrdersButtonClick = () => {
        // Reset keyword and fetch all orders
        setKeyword("");
        setCurrentPage(1);
        fetchOrders(1);
    };
    
    useEffect(() => {
        
        
        if (location.pathname === "/orders") {
            handleOrdersButtonClick();
        }
    }, [location.pathname]);

    const handlePageChange = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPage) {
            const params = new URLSearchParams(location.search);
            const keyword = params.get("keyword");
            if (keyword) {
                navigate(`/orders/page/${pageNum}?keyword=${encodeURIComponent(keyword)}`);
                handleOrderSearch(keyword, pageNum);
            } else {
                navigate(`/orders/page/${pageNum}`);
                fetchOrders(pageNum);
            }
        }
    };

    const handleOrderSearch = async (keyword, pageNum = 1, sortField="orderTime", sortDir="desc") => {
        navigate(`/orders/page/1?keyword=${encodeURIComponent(keyword)}`);

        setIsLoading(true);
        
        try{
            const response = await axios.get(`${baseURL}/orders/page/${pageNum}`, {
                ...config,
                params: { keyword, sortField, sortDir },
                });
            console.log("Orders fetched:", response.data);

            setOrders(response.data.orderList);
            setCurrentPage(pageNum);
            setTotalPage(response.data.totalPage);
        } catch(error){
            console.error("Failed to fetch orders: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            {token && <SearchNavBar handleOrderSearch={handleOrderSearch}/>}
        <div className="orders-page">
            <h2>My Orders</h2>
            {isLoading ? (
                <p>Loading Orders.....</p>
            ): (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Order Time</th>
                            <th>Product</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.orderTime}</td>
                                <td><div dangerouslySetInnerHTML={{ __html: order.productNames }} /></td>
                                <td>{order.total}</td>
                                <td>{order.status}</td>
                                <td>
                                <button className="details-button" title="View Order Details"
                                    onClick={() => alert(`View details for order ${order.id}`)}>
                                    📄
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={()=> handlePageChange(currentPage - 1)}
                    >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPage}
                </span>
                <button
                    disabled={currentPage === totalPage}
                    onClick={()=> handlePageChange(currentPage + 1)}
                    >
                    Next
                </button>
            </div>
        </div>
        </>
        
    );
};

export default OrderPage;