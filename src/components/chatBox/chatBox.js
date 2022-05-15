import './chatBox.scss';
import infoIcon from './info.png'
import { default as icon } from './../icons'
import moment from 'moment';
import { getToken } from '../../helpers'
import { useState, useEffect} from 'react';
import api from '../../api.json'

const connectionStates = [
    'Connecting',
    'Open',
    'Closing',
    'Closed',
    'Uninstantiated',
];

// export const WebSocketDemo = ({ user }) => {
//     //Public API that will echo messages sent to it back to the client
//     const [socketUrl, setSocketUrl] = useState('ws://localhost:3001/ws/chat2/');
//     const [messageHistory, setMessageHistory] = useState([]);
//     document.cookie = `Authorization=${getToken()};`
//     const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl);

//     useEffect(() => {
//         if (lastMessage !== null) {
//             setMessageHistory((prev) => prev.concat(lastMessage));
//         }
//     }, [lastMessage, setMessageHistory]);


//     const getMessages = () => {
//         handleClickSendMessage({
//             'action': 'get_messages',
//             'send_to': user
//         })
//     }
//     useEffect(getMessages, [])

//     const handleClickChangeSocketUrl = useCallback(
//         () => setSocketUrl('wss://demos.kaazing.com/echo'),
//         []
//     );

//     const handleClickSendMessage = useCallback((m) => {
//         sendMessage(JSON.stringify(m)
//         )
//     }, []);

    

//     return (
//         <div>
//             <button onClick={handleClickChangeSocketUrl}>
//                 Click Me to change Socket Url
//             </button>
//             <button
//                 onClick={() => handleClickSendMessage({ 'action': 'add_mesage', 'message': 'ya' })}
//                 disabled={readyState !== ReadyState.OPEN}
//             >
//                 Click Me to send 'Hello'
//             </button>
//             {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
//             <ul>
//                 {messageHistory.map((message, idx) => (
//                     <span key={idx}>{message ? message.data : null}</span>
//                 ))}
//             </ul>
//         </div>
//     );
// };

export default function ChatBox({ room }) {
    const [ws, setWs] = useState()
    const [connectionStatus, setConnectionStatus] = useState(3)
    const [messages, setMessages] = useState([])
    const items_div = document.getElementById('items')

    useEffect(() => {
        let ws = new WebSocket('ws://localhost:3001/ws/chat2/')
        setWs(ws)
        document.cookie = "Authorization=" + getToken();
        document.cookie = "chat-id=" + room.id;

        return () => { setMessages([]); ws.close() }
    }, [room]);

    useEffect(()=>{
        items_div && items_div.scrollTo(0, items_div.scrollHeight)
    },[messages])

    useEffect(()=>{
        ws && console.log(ws)
    },[ws])
    
    if (ws){
        ws.onopen = (e) => {
            console.warn('WebSocket Connected');
            setConnectionStatus(ws.readyState)
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            
            if (data.type === 'get_messages'){
                const saved_messages = data.data;
                setMessages(saved_messages);
            } else {
                const saved_message =  data.text
                setMessages(messages.concat(saved_message))
            }
        }
        ws.onclose = () => {
            console.warn('WebSocket Disconnected');
            setConnectionStatus(ws.readyState)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        ws.send(JSON.stringify(
            {action:'add_message',text: e.target['message'].value}
        ))
        e.target['message'].value = ''
    }

    return (
        <div className="chatBox">
            <div className="head">
                <div className="user">
                    <img src={api.url + room.user.image} alt="i" />
                    <p>{room.user.name} Stataus: {connectionStates[connectionStatus]}</p>
                </div>
                <button><img src={infoIcon} alt="i" /></button>
            </div>

            <div className="body">
                <div className="history">
                    <div id="items" className="items">
                        {messages.map((v, i) => {
                            let cl = 'item other'
                            if (room.user.id !== v.user) cl = 'item'
                            return (<div key={i} className={cl}>{v.content}</div>)
                        })}

                    </div>
                </div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div>{icon.face}</div>
                    <input type="text" name="message" placeholder="Send message" />
                    <div>{icon.like_svg}</div>
                </form>
            </div>
        </div>
    )

}