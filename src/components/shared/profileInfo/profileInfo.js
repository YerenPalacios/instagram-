import './profileInfo.scss'
import { useState } from "react"
import { getUserImage, useFetch } from "../../../helpers"

export function ProfileInfo({ data, style }) {
    const { post, remove, loading } = useFetch()
    const [following, setFollowing] = useState(data.following)
    // TODO: origanize this big and small style
    const btnClass = style === "bigger" ? "commonButton" : "simpleButton"

    const handleFollow = (e) => {
        if (loading) return
        let body = { "following": data.id }
        if (!following)
            post('follow/', body).then(() => {
                setFollowing(true)
            })
        else
            remove('follow/', body).then(() => {
                setFollowing(false)
            })
    }
    // TODO: origanize this big and small style
    return <div className={style === "bigger" ? "profileInfo" : "profileInfo smaller"} >
        <div className="image"><img src={data.image ? data.image : getUserImage(data)} alt="icon" /></div>
        <div className='info'>
            <h3>{data.username}</h3>
            <p>{data.name}</p>
        </div>
        <button onClick={handleFollow} className={loading ? btnClass + " loadingBtn" : btnClass}>{following ? 'Unfollow' : 'Follow'}</button>
    </div>
}