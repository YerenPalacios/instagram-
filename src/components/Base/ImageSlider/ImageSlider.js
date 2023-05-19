import './ImageSlider.scss'
import SimpleImageSlider from 'react-simple-image-slider'

export default function ImageSlider({images}) {
    return <div className="image-slider">
        {images.length === 1 ?
            <SimpleImageSlider
                width={896}
                height={504}
                images={images}
                showBullets={false}
                showNavs={false}
            /> : images.length > 1 &&
            <SimpleImageSlider
                width={896}
                height={504}
                images={images}
                showBullets={true}
                showNavs={true}
            />
        }
    </div>
}