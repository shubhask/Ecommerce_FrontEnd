import { NavLink, useLocation } from "react-router-dom";

export default function AddreesSuccess(){

    const location = useLocation();
    const {value} = location.state || {};
    return (
        <div className="container-fluid">
            <div className="text-center border border-secondary rounded m-3 p-3">
                <h2>Your {value? value : "Your address has been added"} Successfully.</h2>
                <h4>Kindly check in <NavLink
                    to="/address_book"
                    className="nav-link" style={{ textDecoration: 'underline' }}>
                    Address Book
                </NavLink> </h4>
            </div>
	    </div>
    );
}