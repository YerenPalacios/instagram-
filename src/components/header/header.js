import { default as ico } from '../icons'
import './header.scss'
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gif from './ZKZg.gif'
import NewPost from '../newPost/newPost';
import { useContext } from 'react';
import { AuthContext } from '../../context/datacontext';
import { getUserImage } from '../../helpers';
import Search from '../search/search';

//todo: finish this search

// function Search({ users, loading }) {
//     const usersList = users?.map((e, i) => (
//         <div key={i} className="user">
//             <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Woman_1.jpg" alt="" />
//             <div>
//                 <p>TestUserName</p>
//                 <p>User name</p>
//             </div>
//         </div>
//     ))
//     return (
//         <div className="search-list">
//             {!loading ?
//                 usersList
//                 : <div className="loading">
//                     <img src={gif} alt="" />
//                 </div>
//             }
//         </div>
//     )
// }

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
                </div> Profile
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
    const location = useLocation()
    const current = location.pathname
    const [usersList, setUsersList] = useState([1])
    const [showList, setShowList] = useState(false)
    const [listLoading, setListLoading] = useState(false)
    const [showNewPostDiv, setShowNewPostDiv] = useState(false);
    const [currentTab, setCurrentTab] = useState();
    const header = useRef()

    const handleFocus = () => {
        setShowList(!showList)
    }

    const getCurrent = (e)=>{
        if (current === e) return 'current'
    }

    const changeTab = (component) =>{
        if (currentTab?.type == component?.type){
            header.current?.classList.remove('without_labels')
            setCurrentTab(undefined)
        } else {
            header.current?.classList.add('without_labels')
            setCurrentTab(component)
        }
    }

    return (
        <header ref={header}>
            <div className='logo'>{ico.logo}</div>
            {/* <div className="search">
                <input onBlur={handleFocus} onFocus={handleFocus} type="search" size="30" placeholder="Buscar" />

                {showList && <Search loading={listLoading} users={usersList} />}
            </div> */}
            <div className="icons">
                <Icon ico={ico.home} label={'Home'} type='link' to='/'/>
                <Icon ico={ico.search} label={'Search'} onClick={()=>changeTab(<Search/>)}/>
                <Icon ico={ico.share} label={'Messages'} type='link' to='/inbox'/>
                <Icon ico={ico.add} label={'Create'} onClick={() => setShowNewPostDiv(true)}/>
                <Icon ico={ico.find} label={'Explore'} type='link' to='/explore'/>
                <Icon ico={ico.like_svg} label={'Notifications'} onClick={()=>changeTab(<Search/>)}/>
                <UserMenu />
            </div>
            {showNewPostDiv && <NewPost hide={setShowNewPostDiv}></NewPost>}
            {currentTab && <div className='extra_div'>
                {currentTab}
            </div>}

        </header>
    )
}

function Icon({ico,label,type='button', to='/',onClick=undefined}){
    const location = useLocation()
    const getCurrent = (e)=>{
        if (location.pathname === e) return 'current'
    }
    switch (type) {
        case 'link':
            return <Link className={getCurrent(to)} to={to}>{ico} <span>{label}</span></Link>
    
        default:
            return <button onClick={onClick}>{ico} <span>{label}</span></button>
    }
}