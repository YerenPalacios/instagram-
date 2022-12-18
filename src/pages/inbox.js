import { useState } from 'react'
import Header from '../components/haeader/header'
import './pages.css'
import Error from '../components/errors/error'
import ChatContainer from '../components/chatContainer/chatContainer'


export default function Inbox() {
    const [error, setError] = useState(false)

    return (
        <div>
            {error ? <Error error={error} /> : null}
            <Header />
            <ChatContainer />
        </div>

    )
}