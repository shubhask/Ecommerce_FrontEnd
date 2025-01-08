import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";
import FormatTime from "../utill/FormatTime";

export default function ProductReview(props){
    const product = props.productsDump.product;
    const reviewList = props.productsDump.reviewList;
    return (
        <div id="review">
            <div className="row"><div className="col"><hr/></div></div>
            <div className="row m-1">
                <h3>Customer Reviews:</h3>
            </div>
            
            <div className="row m-1">
                <div className="col-xs">
                    <StarRatings
                    rating={product.averageRating}
                    starRatedColor="yellow"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px"
                    />  
                </div>
                <div className="col-xs ml-1 mt-3">
                    <span className="ratingNumber">{product.averageRating}</span> of 5
                </div>
            </div>
            
            <div className="row m-1 ml-3">
                <Link to={`/ratings/${product.alias}`}>view All {product.reviewCount} rating(s)</Link>
            </div>
            
            {props.customerReviewed && <div className="row m-1 ml-3">
                <span className="text-success">You already reviewed this product</span>
            </div>}
            
            {props.customerCanReview && <div className="row m-1 ml-3">
                <span className="text-info">
                    You purchased and got this product. 
                    <b>
                        <Link to={`/write_review/product/${product.id}`}>Write Your Review Now</Link>
                    </b>
                </span>
            </div>}
            
            <div className="row"><div className="col"><hr/></div></div>
            
            <div className="row m-2">
                <div className="col">
                    {reviewList && reviewList.map((review) => {
                        return (
                            <div>
                                <div className="row">
                                    <div className="col-xs">
                                        <StarRatings
                                            rating={review.rating}
                                            starRatedColor="yellow"
                                            numberOfStars={5}
                                            name="rating"
                                            starDimension="20px"
                                            starSpacing="2px"
                                        /> 
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col"><b>{review.headline}</b></div>
                                </div>
                                <div className="row">
                                    <div className="col">{review.comment}</div>
                                </div>
                                <div className="row">
                                    <div className="col ml-3"><small>{review.customerId} , <FormatTime time={review.reviewTime} /></small></div>
                                </div>
                                <div className="row"><div className="col"><hr/></div></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}