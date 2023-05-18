import './postWindow.scss'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import SimpleImageSlider from "react-simple-image-slider/dist/ImageSlider";

export default function PostWindow() {
    const {current_post} = useSelector((state) => state);

    if (!current_post){console.log(current_post);return null}
        
    return <div className="post-window">
        <div className="images">
                <img src={current_post.images[0].image} alt="" />

            </div>      
    </div>
}