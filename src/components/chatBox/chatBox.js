import './chatBox.scss';
import infoIcon from './info.png'
import {default as icon} from './../icons'
import moment from 'moment';
import {useFetch} from '../../helpers'
import { useState, useEffect, useRef} from 'react';
import api from '../../api.json'

export default function ChatBox({user}){

    const [messages, setMessages] = useState([])
    const res = useFetch(`message/?send_to=${user.id}`, null, true)
    const isMounted = useRef(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        
        res.post({
            text:e.target['message'].value
        })
        e.target['message'].value = ''
    }

    useEffect(() => {
        if (isMounted){
            const a = document.getElementById("items")
            a.scrollTop = a.scrollHeight
            res.data && setMessages(res.data)
        }
    }, [res, user])

    useEffect(() => {
        isMounted.current = true
        return () => {isMounted.current = false}
    }, [])

    return (
        <div className="chatBox">
            <div className="head">
                <div className="user">
                    <img src={api.url+user.image} alt="i" />
                    <p>{user.name}</p>
                </div>
                <button><img src={infoIcon} alt="i" /></button>
            </div>

            <div className="body">
                <div className="history">
                    <div id="items" className="items">
                        {messages.map((v,i)=>{
                            let cl = 'item other'
                            if (user.id !== v.user) cl = 'item'
                            return (<div key={i} className={cl}>{v.text}</div>)
                        })}
                    </div>
                </div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div>{icon.face}</div>
                    <input type="text" name="message" placeholder="Send message"/>
                    <div>{icon.like_svg}</div>
                </form>
            </div>
        </div>
    )

}