import './notification.scss'
import React from 'react'
import ProfilesList from "../../profilesList/profilesList";
import notificationsImage from "../../../assets/notificationsHeart.png";
import { Link } from 'react-router-dom';

export default function Notifications(){
    return <div className="notifications">
        <h1>Notifications</h1>
        <article>
            <img src={notificationsImage} alt="" />
            <p>Activity On Your Posts</p>
            <p>When someone likes or comments one of your posts, you'll see it here.</p>
        </article>
        <ProfilesList limit={10}></ProfilesList>
        <Link className='blue-link' to='/explore/people'>See all suggestions</Link>
        <br />
    </div>
}