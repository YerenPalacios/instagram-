import { useState } from "react";
import Header from "../components/header/header";
import Page from "../components/page/page";
import { ProfileForm, PasswordForm } from "../components/profileForm/profileForm";


function Menu({ actual, click }) {
    return (
        <div className="menu">
            <button onClick={() => { click(1) }} className={actual === 1 && 'actual'}>Editar perfil</button>
            <button onClick={() => { click(2) }} className={actual === 2 && 'actual'}>Cambiar contraseña</button>
        </div>
    )
}

export default function Profile() {
    const [actual, setActual] = useState(1)
    var setting = actual === 1 ? <ProfileForm /> :
        actual === 2 ? <PasswordForm /> : null

    const handleActual = (num) => {
        setActual(num)
    }

    return (
        <Page>
            <section className="profile-settings">
                <Menu click={handleActual} actual={actual} />
                {setting}
            </section>
        </Page>
    )
}