import { addForcedExpansions, addForcedImplications, getInstanceAttribute } from "@/app/actions/instanceHelper"
import { Mode, useGraphStore, WorkflowStep } from "@/app/store/useGraphStore"
import { InstanceGetter, TermData } from "@/app/types/graph"
import { addTerm } from "@/app/actions/termSetHelper"

import PlaceTermField from "./PlaceTermField"
import Button from "@/app/components/button"

import { useEffect, useState } from "react"

export function PlaceTermModal() {

    const setMode = useGraphStore((state) => state.setMode)
    const setWorkflowStep = useGraphStore((state) => state.setWorkflowStep)
    const [terms, setTerms] = useState<TermData[]>([])
    const [selectedTermSets, setSelectedTermSets] = useState<Record<string, string>>({})
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)

    const refresh = async () => {
        const terms = await getInstanceAttribute(InstanceGetter.terms)
        setTerms(terms)
    }

    const handleSubmit = async () => {
        for (const [termName, termSetId] of Object.entries(selectedTermSets)) {
            await addTerm(termSetId, termName)
        }
        await addForcedImplications()
        await addForcedExpansions()
        setWorkflowStep(WorkflowStep.Done)
        setMode(Mode.waiting)
        bumpRefresh()
    }

    useEffect(() => {
        refresh()
    }, [])

    return (

        <div className="ml-2 py-2">
            {terms.length === 0 &&
                <div>No terms exist</div>
            }

            {terms.map((term) =>
                <PlaceTermField
                    term={term}
                    selected={selectedTermSets}
                    setSelected={setSelectedTermSets}
                    key={term.name}
                />
            )}
            <div className="w-fit mt-2">
                <Button onClick={handleSubmit}>Submit</Button>

            </div>
        </div>
    )
}