import { useGraphStore } from "@/app/store/useGraphStore";
import { deleteImplication } from "@/app/actions/instanceHelper";
import { ImplicationData } from "@/app/types/graph";

import openEyeIcon from '@/public/open_eye_icon.png'
import hiddenEyeIcon from '@/public/hidden_eye_icon.png'
import trashIcon from '@/public/trash_icon.png'

import { useState } from "react";
import Image from 'next/image'

export default function ImplicationSidebar(
    { implication }:
        { implication: ImplicationData }
) {

    const [hover, setHover] = useState(false)

    const hiddenImplications = useGraphStore((state) => state.hiddenImplications)
    const setHiddenImplications = useGraphStore((state) => state.setHiddenImplications)
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)

    const toggleVisibility = () => {
        const implicationSet = new Set([implication.id])
        if (hiddenImplications.has(implication.id)) {
            const newSet = hiddenImplications.difference(implicationSet)
            setHiddenImplications(newSet)
        } else {
            const newSet = hiddenImplications.union(implicationSet)
            setHiddenImplications(newSet)
        }
        bumpRefresh()
    }

    const handleDelete = async () => {
        await deleteImplication(implication.id)
        bumpRefresh()
    }

    return (
        <div
            className={(hover ? 'bg-btn-hover' : 'bg-inherit') + ' ' + 'flex justify-between rounded p-1 pl-2 my-2 h-fit'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div>
                {implication.input[0].name},
                {' ' + implication.input[1].name} →
                {implication.output.name}
            </div>
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
                        src={!hiddenImplications.has(implication.id) ? openEyeIcon : hiddenEyeIcon}
                        width={25}
                        height={25}
                        alt={!hiddenImplications.has(implication.id) ? "Hide" : "Show"}
                        className=""
                    />
                </button>
            </div>
        </div>
    )
}