'use client'

import { addClause, addForcedPlacements, getInstanceAttribute, resetInstance, resetPlacements } from "@/app/actions/instanceHelper"
import { ClauseData, ExpansionData, ImplicationData, InstanceGetter } from "@/app/types/graph"
import { useGraphStore, Mode, WorkflowStep } from "@/app/store/useGraphStore"

import ClauseSidebar from "./ClauseSidebar"
import ExpansionSidebar from "./ExpansionSidebar"
import ImplicationSidebar from "./ImplicationSidebar"
import Button from "@/app/components/button"

import { useEffect, useState } from "react"
import Collapsible from "react-collapsible"

export function GraphSidebar() {

    const [clauses, setClauses] = useState<ClauseData[]>([])
    const [expansions, setExpansions] = useState<ExpansionData[]>([])
    const [implications, setImplications] = useState<ImplicationData[]>([])

    const selectedClauses = useGraphStore((state) => state.selectedClauses)
    const refreshVersion = useGraphStore((state) => state.refreshVersion)
    const hiddenClauses = useGraphStore((state) => state.hiddenClauses)
    const mode = useGraphStore((state) => state.mode)
    const workflowStep = useGraphStore((state) => state.workflowStep)


    const setMode = useGraphStore((state) => state.setMode)
    const setWorkflowStep = useGraphStore((state) => state.setWorkflowStep)
    const setSelectedClauses = useGraphStore((state) => state.setSelectedClauses)
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)

    useEffect(() => {
        const refresh = async () => {
            const newClauses = await getInstanceAttribute(InstanceGetter.clauses)
            const newExpansions = await getInstanceAttribute(InstanceGetter.expansions)
            const newImplications = await getInstanceAttribute(InstanceGetter.implications)
            setClauses(newClauses)
            setExpansions(newExpansions)
            setImplications(newImplications)
        }
        refresh()
    }, [refreshVersion])

    const toggleMode = (newMode: Mode) => {
        if (mode === newMode) {
            setMode(Mode.waiting)
        } else {
            setSelectedClauses([])
            setMode(newMode)
        }

    }

    const handleAddClause = async () => {
        await addClause()
        bumpRefresh()
    }

    const handleAddForcedPlacements = async () => {
        await addForcedPlacements()
        setWorkflowStep(WorkflowStep.PlacingTerms)
        bumpRefresh()
    }

    const handleResetInstance = async () => {
        await resetInstance()
        setWorkflowStep(WorkflowStep.AddingClauses)
        bumpRefresh()
    }

    const handleResetPlacements = async () => {
        await resetPlacements()
        setWorkflowStep(WorkflowStep.AddingClauses)
        bumpRefresh()
    }

    const getTransitionSpeed = (arr: Array<ClauseData | ExpansionData | ImplicationData>) => {
        return (arr.length + 1) * 50
    }

    return (
        <div className="bg-surface h-full max-h-full pl-2 overflow-y-scroll">
            <div>Read the <a href="./sat/docs" className="underline text-blue-600 italic">docs!</a></div>
            <Collapsible
                trigger="> Clauses:"
                triggerWhenOpen="v Clauses:"
                transitionTime={getTransitionSpeed(clauses)}
                open={true}
            >
                <div className="p-2">
                    <div className="w-fit">
                        <Button onClick={handleAddClause}>Add Clause</Button>
                    </div>
                    {clauses.map(clause => (
                        <ClauseSidebar
                            key={clause.name}
                            clause={clause}
                        />
                    ))}
                </div>
            </Collapsible>
            <Collapsible
                trigger="> Expansions:"
                triggerWhenOpen="v Expansions:"
                transitionTime={getTransitionSpeed(expansions)}
                open={true}
            >
                <div className="p-2">
                    <div className="w-fit">
                        <Button onClick={() => toggleMode(Mode.addExpansion)}>Add Expansion</Button>
                    </div>
                    {expansions.map(expansion => (
                        <ExpansionSidebar
                            key={expansion.id}
                            expansion={expansion}
                        />
                    ))}
                    {mode === Mode.addExpansion &&
                        <>
                            <div>Click on the headers of two clauses to complete the connection</div>
                            {selectedClauses.length === 0 &&
                                <div>_ expands to _</div>
                            }
                            {selectedClauses.length === 1 &&
                                <div>{selectedClauses[0].name} expands to _</div>
                            }
                        </>
                    }
                </div>
            </Collapsible>
            <Collapsible
                trigger="> Implications:"
                triggerWhenOpen="v Implications:"
                transitionTime={getTransitionSpeed(implications)}
                open={true}
            >
                <div className="p-2">
                    <div className="w-fit">
                        <Button onClick={() => toggleMode(Mode.addImplication)}>Add Implication</Button>
                    </div>
                    {implications.map(implication => (
                        <ImplicationSidebar
                            key={implication.id}
                            implication={implication}
                        />
                    ))}
                    {mode === Mode.addImplication &&
                        <>
                            <div>Click on the headers of input 1, input 2, then output to complete the implication</div>
                            {selectedClauses.length === 0 &&
                                <div>_, _ implies _</div>
                            }
                            {selectedClauses.length === 1 &&
                                <div>{selectedClauses[0].name}, _ implies _</div>
                            }
                            {selectedClauses.length === 2 &&
                                <div>{selectedClauses[0].name}, {selectedClauses[1].name} implies _</div>
                            }
                        </>
                    }
                </div>
            </Collapsible>
            {workflowStep === WorkflowStep.AddingClauses &&
                <div className="w-fit my-2 mx-1">
                    <Button onClick={handleAddForcedPlacements}>Add Implied Terms and TermSets</Button>
                </div>
            }
            {workflowStep === WorkflowStep.PlacingTerms &&
                <div className="w-fit my-2">
                    <Button onClick={() => toggleMode(Mode.placeTermModal)}>Place Terms</Button>
                </div>
            }
            <div className="my-2 h-[2px] bg-gray-500"></div>
            <div className="w-fit my-2 mx-1">
                <Button onClick={handleResetInstance}>Reset Instance</Button>
            </div>
            <div className="w-fit my-2 mx-1">
                <Button onClick={handleResetPlacements}>Reset Placements</Button>
            </div>
            <div className="h-[100px]"></div>
        </div>
    )
}