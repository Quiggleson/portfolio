import { Mode, useGraphStore } from "@/app/store/useGraphStore";
import { setLength } from "@/app/actions/clauseHelper";
import { TermSetData } from "@/app/types/graph";

import Button from "@/app/components/button";
import Collapsible from "react-collapsible";

import { useState } from "react";

export default function ClauseModalBody() {

    const clause = useGraphStore((state) => state.selectedClauses[0])
    const setMode = useGraphStore((state) => state.setMode)
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)

    const [localLength, setLocalLength] = useState(clause.length)
    const [termSets, setTermSets] = useState<TermSetData[]>([])

    const handleSave = async () => {
        await setLength(clause.id, localLength)
        bumpRefresh()
        setMode(Mode.waiting)
    }

    return (
        <div className="ml-2 pl-2 py-2 h-fit max-h-[600px] overflow-y-scroll overflow-x-visible">
            <div>
                <label htmlFor="length">Length</label>
                <input
                    className="rounded ml-2 text-center"
                    name="length"
                    size={String(localLength).length}
                    defaultValue={clause.length}
                    onChange={(e) => setLocalLength(Number(e.target.value))}
                />
            </div>
            <div>
                <Collapsible
                    trigger="> Term Sets"
                    triggerWhenOpen="v Term Sets"
                    open={true}
                >
                    {!clause.termSets.length &&
                        <div className="pl-2">No Term Sets</div>
                    }
                    {clause.termSets.map((termSet) => (
                        <div className="pl-2" key={termSet.id}>{termSet.name} length {termSet.length}</div>
                    ))}
                </Collapsible>
            </div>
            <div>
                <Collapsible
                    trigger="> Known Terms"
                    triggerWhenOpen="v Known Terms"
                    open={true}
                >
                    {!clause.known.length &&
                        <div className="pl-2">No Known Terms</div>
                    }
                    {clause.known.map((term) => (
                        <div className="pl-2" key={term.name}>{term.name} {term.inTermSets.length === 0 ? " unplaced" : " in " + term.inTermSets[0].name}</div>
                    ))}
                </Collapsible>
            </div>
            <div>
                <Collapsible
                    trigger="> Excluded Terms"
                    triggerWhenOpen="v Excluded Terms"
                    open={true}
                >
                    {!clause.excluded.length &&
                        <div className="pl-2">No Excluded Terms</div>
                    }
                    {clause.excluded.map((term) => (
                        <div className="pl-2" key={term.name}>{term.name}</div>
                    ))}
                </Collapsible>
            </div>
            <div className="w-fit mt-2">
                <Button onClick={handleSave}>Submit</Button>
            </div>
        </div>
    )
}