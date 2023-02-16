import { useState, useEffect } from "react";
import { useFetch } from "../../helpers";
import { ProfileInfo } from "../shared/profileInfo/profileInfo";

export default function ProfilesList() {
    const { get } = useFetch()
    const [users, setUsers] = useState([])

    useEffect(() => {
        get('user/').then(data => {
            setUsers(data.map(i => <ProfileInfo style='bigger' key={i.id} data={i} />))
        })
    }, [])

    return <div className="explorePeopleContainer">
        <h4>Suggested</h4>
        <div className="users">
            {users}
        </div>
    </div>
}