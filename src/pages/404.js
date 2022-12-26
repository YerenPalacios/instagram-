import { Link } from 'react-router-dom'
import Header from '../components/header/header'
import Page from '../components/page/page'

export default function View404() {
    return (
        <Page>
            <div className="not-found">
                <h1>Esta página no está disponible.</h1>
                <p>Es posible que el enlace que seleccionaste esté roto o que se haya eliminado la página.</p>
                <Link to="/">Volver a Instagram.</Link>
            </div>
        </Page>
    )
}
