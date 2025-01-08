import { Form, NavLink, useRouteLoaderData, useNavigate } from 'react-router-dom';
import { useState } from "react";
import HeaderCartButton from '../HeaderCartButton';
import { getCustomerName } from '../../utill/Auth';
import classes from './MainNavigation.module.css';
import 'font-awesome/css/font-awesome.min.css';
import { useSelector } from 'react-redux';


function MainNavigation() {
  const token = useRouteLoaderData('root');
  const cartItemCount = useSelector((state) => state.cart.cartItemCount);

    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const customer = getCustomerName();
    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${keyword}`);
        
    };

    const cartHandler = () =>{
        navigate('/carts');
    }

  return (
    <header>
      <nav className='navbar navbar-expand-lg bg-dark navbar-dark'>
        <div className='collapse navbar-collapse'>
        <ul className='navbar-nav d-flex align-items-center'>
        
          <li className='nav-item m-2'>
            <NavLink
              to="/"
              className={({ isActive }) =>
              isActive ? `nav-link ${classes.active}` : 'nav-link'
              }
              // style={({ isActive }) => ({
              //   textAlign: isActive ? 'center' : 'left',
              // })}
              end
            >
              <i className="fa fa-shopping-bag fa-lg" style={{ fontSize: '30px' }}><b> Home</b></i>
              
            </NavLink>
          </li>
          <li className='nav-item m-2'>
            <form className="d-flex align-items-center" onSubmit={handleSearch}>
              <input type="search" name="keyword" value={keyword}
                  placeholder="keyword"
                  onChange={(e) => setKeyword(e.target.value)}
                  className="form-control p-sm-1" style={{ width: '700px' }} required />
              <button type="submit" className='btn btn-outline-success m-2'>Search</button>		
            </form>
          </li>
          {/* {token && <li className='nav-item m-2'>
            <NavLink
              to="/products"
              className={({ isActive }) =>
              isActive ? `nav-link ${classes.active}` : 'nav-link'
              }
            >
              Products
            </NavLink>
          </li>} */}
          {/* <li className='nav-item m-2'>
            <NavLink
              to="/registration"
              className={({ isActive }) =>
              isActive ? `nav-link ${classes.active}` : 'nav-link'
              }
            >
              Registration
            </NavLink>
          </li> */}

          {token && <>
          <li className='nav-item m-2'>
                <NavLink
                    to="/address_book"
                    className={({ isActive }) =>
                    isActive ? `nav-link ${classes.active}` : 'nav-link'
                    }
                >
                    Address
                </NavLink>
            </li>
            {/* <li className='nav-item m-2'>
                <NavLink
                    to="/reviews"
                    className={({ isActive }) =>
                    isActive ? `nav-link ${classes.active}` : 'nav-link'
                    }
                >
                    Reviews
                </NavLink>
            </li> */}
            
            <li className='nav-item m-2'>
                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                    isActive ? `nav-link ${classes.active}` : 'nav-link'
                    }
                >
                    Orders
                </NavLink>
            </li>
            
            <li className="nav-item m-2">
                <HeaderCartButton cartItemCounts={cartItemCount} onClick={cartHandler} />
                {/* <a class="nav-link fas fa-shopping-cart fa-2x" th:href="@{/cart}"></a> */}
            </li>
            </>}
          
          {token && 
          <li className='nav-item m-2'>
                <NavLink
                    to="/account_details"
                    className={({ isActive }) =>
                    isActive ? `nav-link ${classes.active}` : 'nav-link'}
                    state={{ customer }}
                >
                    {customer && <b>{customer.fullName}</b>}
                </NavLink>
            </li>}

          {!token && <li className='nav-item m-2'>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? `nav-link ${classes.active}` : 'nav-link'
              }
            >
              Login
            </NavLink>
          </li>}

          {token && <li className='nav-item m-2'>
            <Form method='post' action='/logout'>
                <button className='nav-link'>Logout</button>
            </Form>
          </li>}
        </ul>
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;
