'use client'

import { useState } from "react"

export default function Button({ children, onClick }: { children: React.ReactNode, onClick: () => void  }) {

    const [hover, setHover] = useState(false)

    const onEnter = () => { setHover(true) }
    const onLeave = () => { setHover(false) }

    return (
        <div onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={() => onClick()}
            className={"rounded px-1 w-full select-none outline " +
                (hover ? "bg-btn-hover" : "bg-inherit")}>
            {children}
        </div>
    )

}