import './post.scss'
import { useState } from 'react'
import moment from 'moment'
import { default as ico } from './../icons'
import { useFetch } from '../../helpers'
import PostOptions from '../postOptions/postOptions';
import ImageSlider from '../Base/ImageSlider/ImageSlider'
import { useDispatch } from 'react-redux'
import { getUserImage } from '../../helpers'
import { useEffect } from 'react'

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

function getImage(content) {
        const url = 'data:image/jpeg;base64,'+content
        // debugger
        // content = content.replace('b', '').replace("'", '')
        
        // var base64String = content; // Ejemplo de cadena de base64

        // // Decodificar la cadena de base64
        // var byteCharacters = atob(base64String);

        // // Convertir los caracteres en un array de bytes
        // var byteNumbers = new Array(byteCharacters.length);
        // for (var i = 0; i < byteCharacters.length; i++) {
        //     byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // var byteArray = new Uint8Array(byteNumbers);

        // // Crear el objeto Blob
        // var blob = new Blob([byteArray], { type: 'image/jpeg' });
        // let url =URL.createObjectURL(blob)
        // console.log(url)
        return url;
}

export default function Post({ data, type }) {
    const { post, get, loading } = useFetch()
    const [options, setOptions] = useState(false)
    const images = data.images.map(img => ({ url: getImage(img.image) }))
    var date = moment(data.created_at).fromNow()
    const [comments, setComments] = useState(null)

    function mapComments(comments) {
        return comments.map((c, i) => (
            <p key={i} className="comment"><b>{c.user.name} </b>{c.text}</p>
        ))
    }

    const [liked, setLiked] = useState(data.is_liked)
    const [saved, setSaved] = useState(data.is_saved)
    const [numLikes, setNumLikes] = useState(data.likes_count)
    const [userComments, setUserComments] = useState({
        comments: mapComments([]),
        count: data.count_comments
    })
    const dispatch = useDispatch();

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
                //TODO: make this works
                setComments({})
                setText('')
            }
        })
    }

    useEffect(() => {
        if (type == 'small') {
            get('comment/?post=' + data.id).then(
                data => setComments(data)
            )
        }
    }, []);


    function setCurrentPost() {
        dispatch({
            type: "SET_CURRENT_POST",
            payload: data
        })
    }

    const buttons = <div className="buttons">
        <div>
            <button onClick={handleLike}>
                {liked ? ico.liked_svg : ico.like_svg}
            </button>
            <button onClick={setCurrentPost}>{ico.comment}</button>
            <button>{ico.share}</button>
        </div>
        <button onClick={handleSave}>{saved ? ico.saved : ico.save}</button>
    </div>

    const slider = <ImageSlider images={images}></ImageSlider>
    const info = <div className="text">
        <p><b>{numLikes} Me gusta</b></p>
        <p className="comment"><b>{data.user.name} </b>{data.text}</p>
        <p className="last_text">Ver los {data.comments_count} comentarios</p>
        <p className="last_text">{date}</p>
    </div>


    const small_info = <div className="text">
        <p><b>{numLikes} Me gusta</b></p>
        <p className="last_text">{date}</p>
    </div>
    const head = <div className="head">
        <div className="user">
            <div className='icon'><img src={getUserImage(data)} alt="user" /></div>
            <p>{data.user.username}</p>
        </div>
        {/* TODO: this button is not working in small post */}
        <button onClick={() => { setOptions(true) }}>•••</button>
    </div>

    const comment_form = <CommentForm text={text} setText={setText} onComment={handleComment} />
    //TODO make this with styles and add the NO comments yet.
    const comments_list = <div className="comments">
        {comments?.map(comment => (<div>{comment.text}</div>))}
    </div>

    if (type === 'small')
        return <div className="small-post">
            {slider}
            <div>
                {head}
                {comments_list}
                {buttons}
                {small_info}
                {comment_form}
            </div>
        </div>
    return (
        <div className="post">
            {options && <PostOptions id={data.id} hide={setOptions} />}
            {head}
            {slider}
            {buttons}
            {info}
            {comment_form}
        </div>
    )
}
