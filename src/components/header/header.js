import { default as ico } from '../icons'
import './header.scss'
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NewPost from '../newPost/newPost';
import { useContext } from 'react';
import { AuthContext } from '../../context/datacontext';
import { getUserImage } from '../../helpers';
import Search from '../search/search';
import Notifications from './notifications/notifications';

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

function UserMenu() {
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate()
    const { ref, isVisible } = useComponentVisible(false);

    const logout = () => {
        localStorage.removeItem('auth')
        navigate('/login')
    }

    if (auth)
        return (
            <div className="user-menu" ref={ref}>
                <div className="user-icon">
                    <img src={getUserImage(auth.user)} alt="" />
                </div>
                <p className='label'>Profile</p>
                {isVisible && (
                    <div className="menu">
                        <Link to={"/" + auth.user.username}>{ico.profile} Perfil</Link>
                        <Link to={`/${auth.user.username}/saved`}>{ico.save} Guardado</Link>
                        <Link to={"/edit"}>{ico.settings} Configuración</Link>
                        <Link to="">{ico.change} Cambiar de cuenta</Link>
                        <p onClick={logout} >Salir</p>
                    </div>
                )}
            </div>
        )
    else return null
}

export default function Header() {
    const [showNewPostDiv, setShowNewPostDiv] = useState(false);
    const [currentTab, setCurrentTab] = useState();
    const header = useRef()

    const changeTab = (component) => {
        if (currentTab?.type == component?.type) {
            header.current?.classList.remove('without_labels')
            setCurrentTab(undefined)
        } else {
            header.current?.classList.add('without_labels')
            setCurrentTab(component)
        }
    }
    return (
        <header ref={header}>
            <div className='logo'>{header.current?.className === 'without_labels' ? ico.ig : ico.logo}</div>
            <div className="icons">
                <Icon ico={ico.home} label={'Home'} type='link' to='/' />
                <Icon ico={ico.search} label={'Search'} onClick={() => changeTab(<Search />)} />
                <Icon ico={ico.share} label={'Messages'} type='link' to='/inbox' />
                <Icon ico={ico.add} label={'Create'} onClick={() => setShowNewPostDiv(true)} />
                <Icon ico={ico.find} label={'Explore'} type='link' to='/explore' />
                <Icon ico={ico.like_svg} label={'Notifications'} onClick={() => changeTab(<Notifications />)} />
                <UserMenu />
            </div>
            {showNewPostDiv && <NewPost hide={setShowNewPostDiv}></NewPost>}
            {currentTab && <div className='extra_div'>
                {currentTab}
            </div>}

        </header>
    )
}

function Icon({ ico, label, type = 'button', to = '/', onClick = undefined }) {
    const location = useLocation()
    const getCurrent = (e) => {
        if (location.pathname === e) return 'current'
    }
    switch (type) {
        case 'link':
            return <Link className={getCurrent(to)} to={to}>{ico} <span>{label}</span></Link>

        default:
            return <button onClick={onClick}>{ico} <span>{label}</span></button>
    }
}