import { Mode, useGraphStore } from "@/app/store/useGraphStore";
import { ClauseData } from "@/app/types/graph";
import { deleteClause } from "@/app/actions/instanceHelper";

import openEyeIcon from '@/public/open_eye_icon.png'
import hiddenEyeIcon from '@/public/hidden_eye_icon.png'
import trashIcon from '@/public/trash_icon.png'
import penIcon from '@/public/pen_icon.png'

import Image from 'next/image'
import { useState } from "react";

export default function ClauseSidebar(
    { clause }:
        { clause: ClauseData }
) {

    const [hover, setHover] = useState(false)

    const hiddenClauses = useGraphStore((state) => state.hiddenClauses)
    const setHiddenClauses = useGraphStore((state) => state.setHiddenClauses)
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)
    const setSelected = useGraphStore((state) => state.setSelectedClauses)
    const setMode = useGraphStore((state) => state.setMode)

    const toggleVisibility = () => {
        const clauseSet = new Set([clause.id])
        if (hiddenClauses.has(clause.id)) {
            const newSet = hiddenClauses.difference(clauseSet)
            setHiddenClauses(newSet)
        } else {
            const newSet = hiddenClauses.union(clauseSet)
            setHiddenClauses(newSet)
        }
        bumpRefresh()
    }

    const handleDelete = async () => {
        await deleteClause(clause.id)
        bumpRefresh()
    }

    const handleEdit = () => {
        setSelected([clause])
        setMode(Mode.clauseModal)
    }

    return (
        <div
            className={(hover ? 'bg-btn-hover' : 'bg-inherit') + ' ' + 'flex justify-between rounded items-center p-1 pl-2 my-2 h-fit w-full'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="truncate">{clause.name} length {clause.length}</div>
            <div className="h-[25px] min-w-fit">
                <button onClick={handleEdit} className="">
                    <Image
                        src={penIcon}
                        width={23}
                        height={23}
                        alt={"Edit"}
                        className=""
                    />
                </button>
                <button onClick={handleDelete} className="">
                    <Image
                        src={trashIcon}
                        width={23}
                        height={23}
                        alt={"Delete"}
                        className=""
                    />
                </button>
                <button onClick={toggleVisibility} className="">
                    <Image
                        src={!hiddenClauses.has(clause.id) ? openEyeIcon : hiddenEyeIcon}
                        width={25}
                        height={25}
                        alt={!hiddenClauses.has(clause.id) ? "Hide" : "Show"}
                        className=""
                    />
                </button>
            </div>
        </div>
    )
}