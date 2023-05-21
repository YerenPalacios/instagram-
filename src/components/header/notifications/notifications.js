import './notification.scss'
import ProfilesList from "../../profilesList/profilesList";

export default function Notifications(){
    return <div className="notifications">
        <h1>Notifications</h1>
        <article>
            ...
            <p>Activity On Your Posts</p>
            <p>When someone likes or comments one of your posts, you'll see it here.</p>
        </article>
        <ProfilesList></ProfilesList>
    </div>
}