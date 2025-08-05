import { getPotentialTermSets } from "@/app/actions/termHelper";
import { TermData, TermSetData } from "@/app/types/graph";

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

export default function PlaceTermField(
    { term, 
        selected, 
        setSelected }: 
    { term: TermData, 
        selected: Record<string, string>,
        setSelected: Dispatch<SetStateAction<Record<string, string>>>}) {

    const [termSets, setTermSets] = useState<TermSetData[]>([])

    useEffect(() => {
        const refresh = async () => {
            const termSets = await getPotentialTermSets(term.name)
            setTermSets(termSets)
        }

        refresh()
    }, [term.name])

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelected(prev => ({ ...prev, [term.name]: event.target.value}))
    }

    return (
        <div className="flex mt-1">
            <div className="w-4">{term.name}</div>
            <select onChange={e => handleChange(e)} className="ml-2 px-2 rounded">
                <option value={0} className="rounded">Select TermSet</option>
                {termSets.map((ts) => (
                    <option value={ts.id} className="rounded" key={ts.id}>{ts.name}</option>
                ))}
            </select>
        </div>
    )
}