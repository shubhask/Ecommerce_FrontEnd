import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { baseURL } from '../utill/appConfig';
import classes from './AddressForm.module.css';
import { getAuthToken } from '../utill/Auth';

const AddreesForm = () => {
  const [countryList, setCountryList] = useState([]);
  const [states, setStates] = useState([]);
  const token = getAuthToken();
  const location = useLocation();
  const navigate = useNavigate();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  };
  
  const existingAddress = location.state?.address;

  
  const initialValues = existingAddress ? {
    firstName: existingAddress.firstName || '',
    lastName: existingAddress.lastName || '',
    phoneNumber: existingAddress.phoneNumber || '',
    addressLine1: existingAddress.addressLine1 || '',
    addressLine2: existingAddress.addressLine2 || '',
    city: existingAddress.city || '',
    state: existingAddress.state || '',
    country: existingAddress.country.id || '',
    postalCode: existingAddress.postalCode || ''
  } : {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    addressLine1: Yup.string().required('Address Line 1 is required'),
    addressLine2: Yup.string(), // Optional, not required
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.number().required('postalCode is required'),
  });

  const handleSubmit = async (values) => {
    const addressData = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      countryId: values.country,
      postalCode: values.postalCode
    };
    
    console.log("Hey Buddy");
  
    try {

      let response;
      if(existingAddress){
        addressData.id = existingAddress.id;
        response = await axios.put( `${baseURL}/customers/addresses`, JSON.stringify(addressData), config);
        console.log('Address updated successfully:', response.data);
        navigate('/address_book', {state: {value: `Your Address with Id: ${existingAddress.id} has been updated successfully`}});  // Navigate after success
      } else {
        response = await axios.post(`${baseURL}/customers/addresses`, JSON.stringify(addressData), config);
        console.log('Address Added successfully:', response.data);
        navigate('/address_book', {state: {value: `Your Address has been added successfully`}});  // Navigate after success
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error adding Address:', error);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
        const response = await getCountries();
        setCountryList(response);
      }
      fetchCountries();

      if(existingAddress?.country.id){
        const fetchStates = async () => {
          const statesByCountry = await getStateByCountry(existingAddress.country.id);
          setStates(statesByCountry);
        };
        fetchStates();
      }
    
  },[existingAddress]);

  const getCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/countries/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Countries:', error);
      return [];
    }
  };

  const handleCountryChange = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    const selectedCountryId = event.target.value;

    const statesByCountry = await getStateByCountry(selectedCountryId);
    setStates(statesByCountry);
  };

  const getStateByCountry = async (selectedCountryId) =>{

    try {
      const response = await axios.get(`${baseURL}/customers/states/list_states_by_country/${selectedCountryId}`, {
        timeout: 5000 // 5 seconds timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching states by country:', error);
      return [];
    }

  }

  return (
    <div className="container-fluid"> 
        <div className="text-center">
            <h1>{existingAddress ? `Edit address ID: ${existingAddress.id}` : 'Add New Address'}</h1>
        </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
      {({ setFieldValue }) => (
        <Form  style={{ maxWidth: '60%', margin: '0 auto' }}>
        <div className="border border-secondary rounded p-3">
          <div className="form-group row p-2">
            <label htmlFor="firstName" className='col-sm-4 col-form-label'>First Name</label>
            <div className='col-sm-8'>
              <Field type="text" id="firstName" name="firstName" className='form-control' />
              </div>
            <ErrorMessage name="firstName" component="div" className={classes.error} />
          </div>

          <div className="form-group row p-2">
            <label htmlFor="lastName" className='col-sm-4 col-form-label'>Last Name</label>
            <div className='col-sm-8'>
              <Field type="text" id="lastName" name="lastName" className='form-control' />
            </div>
            <ErrorMessage name="lastName" component="div" className={classes.error} />
          </div>

          <div className="form-group row p-2">
            <label htmlFor="phoneNumber" className='col-sm-4 col-form-label'>Phone Numer</label>
            <div className='col-sm-8'>
              <Field type="text" id="phoneNumber" name="phoneNumber" className='form-control' />
            </div>
            <ErrorMessage name="phoneNumber" component="div" className={classes.error} />
          </div>
          <div className="form-group row p-2">
            <label htmlFor="addressLine1" className='col-sm-4 col-form-label'>Address Line 1</label>
            <div className='col-sm-8'>
              <Field type="text" id="addressLine1" name="addressLine1" className='form-control' />
            </div>
            <ErrorMessage name="addressLine1" component="div" className={classes.error} />
          </div>

          <div className="form-group row p-2">
            <label htmlFor="addressLine2" className='col-sm-4 col-form-label'>Address Line 2</label>
            <div className='col-sm-8'>
              <Field type="text" id="addressLine2" name="addressLine2" className='form-control' />
            </div>
          </div>

          <div className="form-group row p-2">
            <label htmlFor="country" className='col-sm-4 col-form-label'>Country</label>
            <div className='col-sm-8'>
            <Field
              as="select"
              name="country"
              className="form-control"
              onChange={(event) => {
                const selectedCountryId = event.target.value;
                setFieldValue('country', selectedCountryId); // Update Formik's state
                handleCountryChange(event); // Fetch states for the selected country
              }}
              >
              <option value="" label="Select a country" />
              {countryList.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
              </Field>
            </div>
            <ErrorMessage name="country" component="div" className={classes.error} />
          </div>

          <div className="form-group row p-2">
            <label htmlFor="city" className='col-sm-4 col-form-label'>City</label>
            <div className='col-sm-8'>
            <Field type="text" id="city" name="city" className='form-control' />
            </div>
            <ErrorMessage name="city" component="div" className={classes.error} />
          </div>


          <div className="form-group row p-2">
            <label htmlFor="state" className='col-sm-4 col-form-label'>State</label>
            <div className='col-sm-8'>
              <Field as="select" id="state" name="state"  className='form-control'>
                <option value="" label="Select a state" />
                {states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Field>
            </div>
            <ErrorMessage name="state" component="div" className={classes.error} />
          </div>


          <div className="form-group row p-2">
            <label htmlFor="postalCode" className='col-sm-4 col-form-label'>PostalCode</label>
            <div className='col-sm-8'>
                <Field type="number" id="postalCode" name="postalCode" className='form-control' />
            </div>
            <ErrorMessage name="postalCode" component="div" className={classes.error} />
          </div>
          
          <div className="text-center">
            <button type="submit" className='btn btn-success btn-lg'>{existingAddress? 'Update' : 'Add'}</button>
          </div>

          </div>
        </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddreesForm;
