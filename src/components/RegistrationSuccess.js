import { useLocation } from "react-router-dom";

const RegistrationSuccess = () => {
    const location = useLocation();
    const name = location.state.name;
    return (
        <div className="container-fluid">
            <div className="text-center">
                <h2>Customer Registration</h2>
                <h4>{name}, You have registered successfully.</h4>
                <p>Please check your email to verify your account.</p>
                
            </div>
        </div>
    );
}

export default RegistrationSuccess;