import {default as ico} from '../icons'
import './header.css'

export default function Header(){
    return(
        <header>
            <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="logo" />
            <input type="search" placeholder="Buscar"/>
            <div className="icons">
                <button>{ico.home}</button>
                <button>{ico.share}</button>
                <button>{ico.add}</button>
                <button>{ico.find}</button>
                <button>{ico.like_svg}</button>
                <button>{ico.home}</button>

            </div>
        </header>
    )
}