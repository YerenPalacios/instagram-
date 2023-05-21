import './search.scss'

export default function Search() {
    return <div className='search'>
        <div className='search-head'>
            <h1>Search</h1>
            <input type="text" />
        </div>

        <div className='no-data'>
            <h3>Recent</h3>
            <p>No recent searches.</p>
        </div>
    </div>
}