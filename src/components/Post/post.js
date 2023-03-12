import './post.scss'
import { useState } from 'react'
import SimpleImageSlider from 'react-simple-image-slider'
import moment from 'moment'
import { default as ico } from './../icons'
import { useFetch } from '../../helpers'
import PostOptions from '../postOptions/postOptions';

// TODO: posts must have just user comments in main view

function CommentForm({ onComment, setText, text }) {

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.target.value = ''
            onComment()
        }
    }

    return (
        <div className="add_comment">
            <button>{ico.face}</button>
            <input onKeyDown={handleEnter} onInput={e => setText(e.target.value)} type="text" value={text} placeholder="Agrega un comentario..." />
            <button onClick={onComment}>Publicar</button>
        </div>
    )
}

export default function Post({ data }) {
    const { post, loading } = useFetch()
    const [options, setOptions] = useState(false)
    const images = data.images.map(img => ({ url: img.image }))
    var date = moment(data.created_at).fromNow()

    function mapComments(comments) {
        return comments.map((c, i) => (
            <p key={i} className="comment"><b>{c.user.name} </b>{c.text}</p>
        ))
    }

    const [liked, setLiked] = useState(data.is_liked)
    const [saved, setSaved] = useState(data.is_saved)
    const [numLikes, setNumLikes] = useState(data.likes)
    const [userComments, setUserComments] = useState({
        comments: mapComments(data.comments),
        count: data.count_comments
    })


    const [text, setText] = useState('')

    const handleLike = () => {
        if (loading) return 
        post('like/', { post: data.id }).then(data => {
            data.liked ? setNumLikes(numLikes + 1) : setNumLikes(numLikes - 1)
            setLiked(data.liked)
        })
    }

    const handleSave = () => {
        if (loading) return 
        post('save/', { post: data.id }).then(data => {
            setSaved(data.saved)
        })
    }

    const handleComment = () => {
        post('comment/', { post: data.id, text: text }).then(data => {
            if (data.comments) {
                setUserComments({
                    comments: mapComments(data.comments),
                    count: userComments.count + 1
                })
                setText('')
            }
        })
    }

    return (
        <div className="post">
            {options && <PostOptions id={data.id} hide={setOptions} />}
            <div className="head">
                <div className="user">
                    <div className='icon'><img src={data.user.image} alt="user" /></div>
                    <p>{data.user.username}</p>
                </div>
                <button onClick={() => { setOptions(true) }}>•••</button>
            </div>

            <div className="images">
                {data.images.length === 1 ?
                    <SimpleImageSlider
                        width={896}
                        height={504}
                        images={images}
                        showBullets={false}
                        showNavs={false}
                    /> : data.images.length > 1 &&
                    <SimpleImageSlider
                        width={896}
                        height={504}
                        images={images}
                        showBullets={true}
                        showNavs={true}
                    />
                }

            </div>

            <div className="buttons">
                <div>
                    <button onClick={handleLike}>
                        {liked ? ico.liked_svg : ico.like_svg}
                    </button>
                    <button>{ico.comment}</button>
                    <button>{ico.share}</button>
                </div>
                <button onClick={handleSave}>{saved ? ico.saved : ico.save}</button>
            </div>

            <div className="text">
                <p><b>{numLikes} Me gusta</b></p>
                <p className="comment"><b>{data.user.name} </b>{data.text}</p>
                <p className="last_text">Ver los {userComments.count} comentarios</p>
                {userComments.comments}
                <p className="last_text">{date}</p>
            </div>
            <CommentForm text={text} setText={setText} onComment={handleComment} />
        </div>
    )
}
