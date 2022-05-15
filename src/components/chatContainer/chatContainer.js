import { useEffect, useState} from 'react';
import ChatBox from '../chatBox/chatBox';
import {useFetch} from '../../helpers'
import './chatContainer.scss';
import api from '../../api.json'
import moment from 'moment'

export default function ChatContainer(){
    const res = useFetch('chatlist/')
    const [users,setUsers] = useState([])
    const [actualChat, setActualChat] = useState(null)

    useEffect(() => {
        if (res.data) setUsers(res.data)
    }, [res])

    return(
        <div className="chat-container">
            <div className="chat">
                <div style={{width:300}}>
                    {users.map((i,k)=>(
                        <div key={k} className="person" onClick={()=>setActualChat(i)}>
                            <img src={api.url+i.user.image} alt="" />
                            <div>
                                <p>{i.user.name}</p>
                                <p>{i.last_message.content} . {moment(i.last_message.timestamp).from()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {actualChat&&<ChatBox room={actualChat}/>}
            </div>
        </div>
    )
}
