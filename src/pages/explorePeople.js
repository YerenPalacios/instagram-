import { useState } from "react";
import { useEffect } from "react";
import Page from "../components/page/page";
import { ProfileInfo } from "../components/shared/profileInfo/profileInfo";
import { useFetch } from "../helpers";

export default function ExplorePeople() {
    const { get } = useFetch()
    const [users, setUsers] = useState([])

    useEffect(() => {
        get('user/').then(data => {
            setUsers(data.map(i => <ProfileInfo style='bigger' key={i.id} data={i} />))
        })
    }, [])

    return <Page>
        <div className="explorePeopleContainer">
            <h4>Suggested</h4>
            <div className="users">
                {users}
            </div>
        </div>
    </Page>
}