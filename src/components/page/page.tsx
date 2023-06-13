import React, { ReactNode, RefObject } from "react";
import Header from "../header/header";

export default function Page({ children, container_ref = null }: { children: ReactNode, container_ref: RefObject<HTMLDivElement> | null }) {
    return (
        <>
            <Header />
            <div ref={container_ref} className="container">
                {children}
            </div>
        </>
    )
}