import { NavLink, Form, useActionData } from "react-router-dom";

const Login = () => {
    const data = useActionData();
    function handleSocialMediaHandler(){
        //Handler social media login with Google or Facebook
    }

    return (
        <div className="container-fluid text-center">
		<div>
			<h2>Customer login</h2>
		</div>
		<div className="mt-3">
			<button className="btn btn-lg btn-secondary fab fa-google" onClick={handleSocialMediaHandler}>&nbsp;Continue with Google</button>
		</div>
		<div>&nbsp;</div>
        
        <Form style={{maxWidth: '30%', margin: '0 auto'}} className="p-2" method="post">

        {data && <div className="text-danger m-2">{data}</div>}
        <div className="border border-secondary rounded p-3">
            
            <p>
                <input className="form-control" type="email" name="email" placeholder="E-Mail" required />
            </p>
            
            <p>
                <input className="form-control"  type="password" name="password" placeholder="Password" required />
            </p>
            <p>
            <input type="checkbox" name="remember-me" />&nbsp; Remember me
            </p>
            <p>
                <button className="btn btn-primary btn-lg">Login</button>
            </p>
        </div>
        </Form>
		<div>&nbsp;</div>
		<div>
			Don't have an account? <NavLink to='/registration'>Sing Up</NavLink>
		</div>
	</div>
    )
}

export default Login;