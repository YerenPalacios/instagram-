import './postOptions.scss';

api
export default function PostOptions({id,hide}){
    console.log(id)
    return(
        <div className="post-options">
            <div onClick={()=>hide(!true)} className="close-item"></div>
            <div className="options">
                <button>Eliminar</button>
                <button>Ir a la publicación</button>
                <button>cancelar</button>
            </div>
        </div>
    )
}
