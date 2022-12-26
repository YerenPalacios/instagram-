import Header from "../header/header";

export default function Page({children}){
    return (
        <>
            <Header />
            <div className="container">
                {children}
            </div>
        </>
    )
}