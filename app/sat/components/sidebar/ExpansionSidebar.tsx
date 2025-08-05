import { useGraphStore } from "@/app/store/useGraphStore";
import { ExpansionData } from "@/app/types/graph";
import { deleteExpansion } from "@/app/actions/instanceHelper";

import openEyeIcon from '@/public/open_eye_icon.png'
import hiddenEyeIcon from '@/public/hidden_eye_icon.png'
import trashIcon from '@/public/trash_icon.png'

import { useState } from "react";
import Image from 'next/image'

export default function ExpansionSidebar(
    { expansion }:
        { expansion: ExpansionData }
) {

    const [hover, setHover] = useState(false)

    const hiddenExpansions = useGraphStore((state) => state.hiddenExpansions)
    const setHiddenExpansions = useGraphStore((state) => state.setHiddenExpansions)
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)

    const toggleVisibility = () => {
        const expansionSet = new Set([expansion.id])
        if (hiddenExpansions.has(expansion.id)) {
            const newSet = hiddenExpansions.difference(expansionSet)
            setHiddenExpansions(newSet)
        } else {
            const newSet = hiddenExpansions.union(expansionSet)
            setHiddenExpansions(newSet)
        }
        bumpRefresh()
    }

    const handleDelete = async () => {
        await deleteExpansion(expansion.id)
        bumpRefresh()
    }

    return (
        <div
            className={(hover ? 'bg-btn-hover' : 'bg-inherit') + ' ' + 'flex justify-between rounded p-1 pl-2 my-2 h-fit'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div>{expansion.input.name} → {expansion.output.name}</div>
            <div className="h-[25px]">
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
                        src={!hiddenExpansions.has(expansion.id) ? openEyeIcon : hiddenEyeIcon}
                        width={25}
                        height={25}
                        alt={!hiddenExpansions.has(expansion.id) ? "Hide" : "Show"}
                        className=""
                    />
                </button>
            </div>
        </div>
    )
}