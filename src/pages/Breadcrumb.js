import { Link } from "react-router-dom";

export default function Breadcrumb(props){
    const productsDump = props.productsDump;
    return (
        <div className="row">
        
        { productsDump && (
			<div className="col">
				<nav>
					<ol className="breadcrumb bg-light">
						<li className="breadcrumb-item">
							<Link to='/'>Home</Link>
						</li>
						{productsDump.categoryParents.map((categoryParent) => {
                            return (
                                <li className="breadcrumb-item" key={categoryParent.alias}>
                                    <Link to={`/catalog/c/${categoryParent.alias}`}>{categoryParent.name}</Link>
                                </li>
                            );
                        })}

                        {productsDump.product && 
                                <li class="breadcrumb-item">
                                    <span>{productsDump.product.shortName}</span>
                                </li>    
                        }
					</ol>
				</nav>
			</div>
        )
      }
      </div>
    );
}