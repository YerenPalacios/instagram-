import {default as ico} from '../icons'
import './header.scss'
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gif from './ZKZg.gif'
import api from '../../api.json'
import { getUserSesion } from '../../helpers';
import NewPost from '../newPost/newPost';
import testImg from '../../p.png'

//todo: finish this search

function Search({users, loading}){
    const usersList = users.map((e,i)=>(
        <div key={i} className="user">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Woman_1.jpg" alt="" />
            <div>
                <p>TestUserName</p>
                <p>User name</p>
            </div>
        </div>
    ))
    return(
        <div className="search-list">
            {!loading?
            usersList
            : <div className="loading">
                <img src={gif} alt="" />
            </div>
            }
        </div>
    )
}

function useComponentVisible(initialIsVisible) {
    const [isVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };
    const handleClickin = (event) => {
        if (ref.current && ref.current.contains(event.target)) {
            setIsComponentVisible(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('click', handleClickin, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
            document.removeEventListener('click', handleClickin, true);
        };
    }, []);

    return { ref, isVisible, setIsComponentVisible };
}

function UserMenu({icon, username}){
    const navigate = useNavigate()
    const { ref, isVisible } = useComponentVisible(false);

    const logout = () =>{
        localStorage.removeItem('auth')
        navigate('/login')
    }

    return(
        <div className="user-menu" ref={ref}>
            <div className="user-icon">
                <img src={icon? api.url+icon: testImg} alt="" />
            </div>
            {isVisible && (
                <div className="menu">
                    <Link to={"/"+username}>{ico.profile} Perfil</Link>
                    <Link to={`${username}/saved`}>{ico.save} Guardado</Link>
                    <Link to={"/edit"}>{ico.settings} Configuración</Link>
                    <Link to="">{ico.change} Cambiar de cuenta</Link>
                    <p onClick={logout} >Salir</p>
                </div>
            )}
        </div>
    )
}

export default function Header(){
    const [usersList, setUsersList] = useState([1])
    const [showList, setShowList] = useState(false)
    const {user} = getUserSesion()
    const [listLoading, setListLoading] = useState(false)
    const [showNewPostDiv, setShowNewPostDiv] = useState(false);

    const handleFocus = () => {
        setShowList(!showList)
    }


    return(
        <header>
            {/* <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="logo" /> */}
            <div className="search">
                <input onBlur={handleFocus} onFocus={handleFocus} type="search" size="30" placeholder="Buscar"/>

                {showList? <Search loading={listLoading} users={usersList}/> : null}
            </div>
            <div className="icons">
                <Link to="/">{ico.home}</Link>
                <Link to="/inbox">{ico.share}</Link>
                <button onClick={()=>setShowNewPostDiv(true)}>{ico.add}</button>
                <button>{ico.find}</button>
                <button>{ico.like_svg}</button>
                <UserMenu username={user.username} icon={user.image}/>
            </div>
            {showNewPostDiv?
                <NewPost hide={setShowNewPostDiv}></NewPost>
            :null}

        </header>
    )
}