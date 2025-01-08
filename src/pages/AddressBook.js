import axios from "axios";
import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { baseURL } from "../utill/appConfig";
import { getAuthToken, isTokenExpired } from "../utill/Auth";
import ConfirmModal from "./ConfirmModal";

export default function AddressBook() {
    const [usePrimaryAddressAsDefault, setUsePrimaryAddressAsDefault] = useState(true);
    const [customer, setCustomer] = useState({});
    const [addressList, setAddressList] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalBody, setModalBody] = useState('');
    const [showMessage, setShowMessage] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = getAuthToken();
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const location = useLocation();
    const {value} = location.state || {};
    
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    };

    const getAddress = async () => {
        try {
            if (token && isTokenExpired(token)) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            const response = await axios.get(`${baseURL}/customers/addresses`, config);
            setCustomer(response.data.customer);
            setAddressList(response.data.listAddress);
            setUsePrimaryAddressAsDefault(response.data.usePrimaryAddressAsDefault);

            if(value){
                setMessage(value);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 5000);
                location.state='';
            }
        } catch (error) {
            console.error('Error fetching Address Details:', error);
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const response = await axios.post(`${baseURL}/customers/address_book/default/${addressId}`, {}, config);
            console.log('Default address updated');
            getAddress(); // Refresh the address list
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    useEffect(() => {
        getAddress();
    }, [message]);

    const handleEdit = (address) => {
        navigate('/address_form', {state : {address}});
    };

    const handlePrimaryAddressEdit = (customer) => {
        navigate('/account_details', {state : {customer}});
    };

    const confirmHandler = async () => {
        try {
            const response = await axios.delete(`${baseURL}/customers/address_book/delete/${selectedAddressId}`, config);
            setShowMessage(true);
            setMessage(response.data);
            setShowConfirmModal(false);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        } catch (error) {
            console.error('Error deleting address:', error);
            setShowMessage(true);
            setMessage('Failed to delete address. Please try again.');
    
            // Hide the message after 5 seconds even in case of an error
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        }
    }

    const closeHandler = () => {
        setShowConfirmModal(false);
    }

    const handleDelete = (addressId) => {
        setSelectedAddressId(addressId);
        setModalBody(`Do You want to delete Address Id: ${addressId}?`)
        setShowConfirmModal(true);
    }

    return (
        <div className="container-fluid text-center">
            <h1>Your Address Book</h1>
            <h3>
                <NavLink to="/address_form" className="nav-link" style={{ textDecoration: 'underline' }}>
                    Add New Address
                </NavLink>
            </h3>

            <div className="row m-1">
                {showMessage && <span className="m-3, text-success text-lg text-lalign">{message}</span>}
                <div className="col-sm-6 mt-2">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <b>Your Primary Address </b>
                                    {usePrimaryAddressAsDefault && <span className="btn btn-success"> [Default]</span>}
                                    {!usePrimaryAddressAsDefault && <button onClick={() => setDefaultAddress(0)} className="btn btn-success"> [Set as Default] </button>}
                                </div>
                                <div className="col">
                                    <div className="float-right">
                                        <button className="fas fa-edit icon-dark" title="Edit your primary address" onClick= {() => {handlePrimaryAddressEdit(customer)}}></button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {customer.address}
                        </div>
                    </div>
                </div>
                
                {addressList && addressList.map((address, index) => (
                    <>
                    {showConfirmModal && <ConfirmModal modalBody={modalBody} modalTitle="Warning" onClose={closeHandler} onConfirm={confirmHandler} addressId={address.id}/>}
                    <div className="col-sm-6 mt-2" key={address.id}>
                    
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col">
                                        <b> Address #{index + 2} </b>
                                        {address.defaultForShipping && <span className="text-danger"> [Default] </span>}
                                        {!address.defaultForShipping && <button onClick={() => setDefaultAddress(address.id)} className="btn btn-success"> Set as Default </button>}
                                    </div>
                                    <div className="col">
                                        <div className="float-right">
                                            <button className="fas fa-edit icon-dark m-1" title="Edit your address" onClick= {() => {handleEdit(address)}}></button>
                                            <button className="fas fa-trash icon-dark deleteLink m-1" title={`Delete your address ${index + 2}`} onClick= {() => {handleDelete(address.id)}}></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {address.firstName} {address.lastName}, {address.addressLine1}, 
                                {address.addressLine2 && <> {address.addressLine2} , </>}
                                 {address.city}, {address.state}, {address.postalCode}, {address.country?.name}. Phone Number: {address.phoneNumber}
                            </div>
                        </div>
                    </div>
                    </>
                ))}
            </div>
        </div>
    );
}
