import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classes from './AccountDetails.module.css';
import axios from 'axios';
import { baseURL } from '../utill/appConfig';
import { getAuthToken, setCustomerName } from '../utill/Auth';

const AccountDetails = () => {
  const [countryList, setCountryList] = useState([]);
  const [states, setStates] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAuthToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  };

  const existingCustomer = location.state?.customer;
  if(existingCustomer)
    console.log(existingCustomer)
  const initialValues = existingCustomer ? {
    firstName: existingCustomer.firstName ||'',
    lastName: existingCustomer.lastName ||'',
    password: existingCustomer.password || '',
    email: existingCustomer.email ||'',
    phoneNumber: existingCustomer.phoneNumber ||'',
    addressLine1: existingCustomer.addressLine1 ||'',
    addressLine2: existingCustomer.addressLine2 ||'',
    city: existingCustomer.city ||'',
    state: existingCustomer.state ||'',
    country: existingCustomer.country?existingCustomer.country.id : existingCustomer.countryResponse.id ||'',
    postalCode: existingCustomer.postalCode ||''
  } :{
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    addressLine1: Yup.string().required('Address Line 1 is required'),
    addressLine2: Yup.string(), // Optional, not required
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    // country: Yup.string().required('Country is required'),
    postalCode: Yup.number().required('postalCode is required'),
  });

  const handleSubmit = (values) => {
    let response;
    const accountData = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber:values.phoneNumber,
      email:values.email,
      password: values.password,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city:values.city,
      state: values.state,
      countryId:values.country,
      postalCode:values.postalCode
    };
    console.log("Hey Buddy"); 
    console.log(accountData);
   
    if(existingCustomer){
        accountData.id = existingCustomer.id;
        axios.put(`${baseURL}/customers`, JSON.stringify(accountData), config)
        .then((response) => {
            console.log('Account updated successfully:', response.data);
            setCustomerName(JSON.stringify(response.data));
            navigate('/address_success', {state: {value: "Account has been updated"}});  // Navigate after success
        })
        .catch((error) => {
            console.error('Error updating account:', error);
        });
      } else {
        axios.post(`${baseURL}/customers`, accountData)
        .then((response) => {
        // Handle a successful response here (e.g., show a success message)
        console.log('Account created successfully:', response.data);
        navigate('/register-success', { state: { name: response.data.firstName } });
        })
        .catch((error) => {
        // Handle errors (e.g., show an error message)
        console.error('Error creating account:', error);
        });
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
        const response = await getCountries();
        setCountryList(response);
      }
      fetchCountries();

      if(existingCustomer){
        const fetchStates = async () => {
          const statesByCountry = await getStateByCountry(existingCustomer.country?existingCustomer.country.id: existingCustomer.countryResponse.id);
          setStates(statesByCountry);
          console.log("state name is : "+existingCustomer.state);
        };
        fetchStates();
      }
    
  },[]);

  const getCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/countries/list`);
      console.log(response);
      const data = response.data;
      return data;
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
            <h1>Account Details</h1>
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
            <label htmlFor="email" className='col-sm-4 col-form-label'>Email</label>
            <div className='col-sm-8'>
              <Field type="text" id="email" name="email" className={`form-control ${existingCustomer ? 'readonly-field' : ''}`}  readOnly={existingCustomer} />
            </div>
            <ErrorMessage name="email" component="div" className={classes.error} />
          </div>

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
          
            
          
          {!existingCustomer && 
            <>
                <div className="form-group row p-2">
                    <label htmlFor="password" className='col-sm-4 col-form-label'>Password</label>
                    <div className='col-sm-8'>
                    <Field type="password" id="password" name="password" className='form-control' />
                    </div>
                    <ErrorMessage name="password" component="div" className={classes.error} />
                </div>

                <div className="form-group row p-2">
                    <label htmlFor="confirmPassword" className='col-sm-4 col-form-label'>Confirm Password</label>
                    <div className='col-sm-8'>
                    <Field type="password" id="confirmPassword" name="confirmPassword" className='form-control' />
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className={classes.error} />
                </div>
            </>}
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
              }}>
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
          <div className='text-center m-2'>
          <button type="submit" className='btn btn-success btn-lg'>Update</button>
          </div>
            
          </div>
        </Form>
      )}
      </Formik>
    </div>
  );
};

export default AccountDetails;
