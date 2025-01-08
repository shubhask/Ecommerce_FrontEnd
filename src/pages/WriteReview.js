import { useParams } from "react-router-dom"

export default function WriteReview(){
    const param = useParams();
    return (
        <div>Write review for {param.productId} product</div>
    );
}