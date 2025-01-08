import {  useEffect, useState } from 'react';
import CartIcon from './CartIcon';
import classes from './HeaderCartButton.module.css';

const HeaderCartButton = props => {
    const [btnIshighlighted, setBtnIsHighlighted] = useState(false);
    
    const btnClasses = `${classes.button} ${btnIshighlighted ? classes.bump : ''}`;
    useEffect(() => {
        if(props.cartItemCounts === 0){
            return;
        }
        setBtnIsHighlighted(true);

        const timer = setTimeout(() => {
            setBtnIsHighlighted(false);
        }, 300);

        return () => {
            clearTimeout(timer);
        }
    }, [props.cartItemCounts])
    return (
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon />
            </span>
            <span className={classes.badge}>{props.cartItemCounts}</span>
        </button>
    );
};

export default HeaderCartButton;