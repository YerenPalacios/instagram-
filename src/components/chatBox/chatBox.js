import './chatBox.scss';
import infoIcon from './info.png'
import {default as icon} from './../icons'

export default function ChatBox(){

    return (
        <div className="chatBox">
            <div className="head">
                <div className="user">
                    <img src={infoIcon} alt="i" />
                    <p>user name</p>
                </div>
                <button><img src={infoIcon} alt="i" /></button>
            </div>

            <div className="body">
                <div className="history">
                    nada
                </div>
                <form>
                    <div>{icon.face}</div>
                    <input type="text" />
                    <div>{icon.like_svg}</div>
                </form>
            </div>
        </div>
    )

}