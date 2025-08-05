'use client'

import { Mode, useGraphStore } from "../store/useGraphStore"

import { GraphSidebar } from "./components/sidebar/GraphSidebar"
import { GraphCanvas } from "./components/canvas/GraphCanvas"
import { PlaceTermModal } from "./components/modals/PlaceTermModal"
import ClauseModalBody from "./components/modals/ClauseModalBody"
import Modal from "./components/modals/Modal"

import { useEffect, useState } from "react"

export default function Sat() {
    
    const mode = useGraphStore((state) => state.mode)
    const setMode = useGraphStore((state) => state.setMode)
    const selectedClauses = useGraphStore((state) => state.selectedClauses)
    const [session, setSession] = useState(false)

    useEffect(() => {
        if (!document.cookie.includes('session-id')) {
            fetch('/api/session/init').then(r =>
                setSession(true)
            )
        }
    }, [])

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMode(Mode.waiting)

            }
        }

        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [setMode])

    return (
        <>
            <div className={"h-full flex " + (mode === Mode.clauseModal || mode === Mode.placeTermModal ? "pointer-events-none select-none" : "")}>
                {session &&
                    <>
                        <div className="w-1/4 h-full p-0">
                            <GraphSidebar></GraphSidebar>
                        </div>
                        <GraphCanvas></GraphCanvas>

                    </>
                }
                {!session &&
                    <div>Loading content, please wait</div>
                }
            </div>
            {mode === Mode.clauseModal &&
                <Modal
                    header={"Clause " + selectedClauses[0].name}
                    body={<ClauseModalBody />}
                />
            }
            {mode === Mode.placeTermModal &&
                <Modal
                    header="Place Terms"
                    body={<PlaceTermModal />}
                />
            }
        </>
    )
}