'use client'

import { useGraphStore, Mode, WorkflowStep } from "@/app/store/useGraphStore"
import { ClauseData } from "@/app/types/graph"
import { addExpansion, addImplication } from "@/app/actions/instanceHelper"
import Button from "@/app/components/button"
import Collapsible from "react-collapsible"

export default function ClauseCanvas({ clause }: { clause: ClauseData }) {

    const mode = useGraphStore((state) => state.mode)
    const workflowStep = useGraphStore((state) => state.workflowStep)
    const selectedClauses = useGraphStore((state) => state.selectedClauses)
    const setSelectedClauses = useGraphStore((state) => state.setSelectedClauses)
    const addSelectedClause = useGraphStore((state) => state.addSelectedClause)
    const setMode = useGraphStore((state) => state.setMode)
    const bumpRefresh = useGraphStore((state) => state.bumpRefresh)

    const onClick = () => {
        if (mode === Mode.addExpansion && selectedClauses.length === 1) {
            addExpansion(selectedClauses[0], clause)
            setMode(Mode.waiting)
            setSelectedClauses([])
            bumpRefresh()
        } else if (mode === Mode.addImplication && selectedClauses.length === 2) {
            const a = selectedClauses[0]
            const b = selectedClauses[1]
            addImplication([a, b], clause)
            setMode(Mode.waiting)
            setSelectedClauses([])
            bumpRefresh()
        } else {
            addSelectedClause(clause)
        }
    }

    return (
        <div className="outline rounded w-fit my-4 bg-surface">
            <div className="relative left bg-surface-dark">
                <Button onClick={onClick}>
                    <div>{clause.name} length {clause.length}</div>
                </Button>
            </div>
            {/* Term Sets */}
            <div className="px-2">
                <Collapsible
                    trigger="> Term Sets"
                    triggerWhenOpen="v Term Sets"
                    open={clause.termSets.length > 0}
                >
                    <div className="px-2">
                        {clause.termSets.length === 0 &&
                            <div>No Term Sets</div>
                        }
                        {clause.termSets.map((t) =>
                            <div key={t.id}>{t.name} length {t.length}</div>
                        )}
                    </div>
                </Collapsible>
            </div>
            {/* Known */}
            <div className="px-2">
                <Collapsible
                    trigger="> Known"
                    triggerWhenOpen="v Known"
                    open={clause.known.length > 0}
                >
                    <div className="px-2">
                        {clause.known.length === 0 &&
                            <div>No known terms</div>
                        }
                        {clause.known.map((t) =>
                            <div key={t.name}>{t.name}</div>
                        )}
                    </div>
                </Collapsible>
            </div>
            {/* Placed */}
            <div className="px-2">
                <Collapsible
                    trigger="> Placed"
                    triggerWhenOpen="v Placed"
                    open={clause.placed.length > 0}
                >
                    <div className="px-2">
                        {clause.placed.length === 0 &&
                            <div>No placed terms</div>
                        }
                        {clause.placed.map((t) =>
                            <div key={t.name}>{t.name} in {t.inTermSets[0].name}</div>
                        )}
                    </div>
                </Collapsible>
            </div>
            {/* Excluded */}
            <div className="px-2">
                <Collapsible
                    trigger="> Excluded"
                    triggerWhenOpen="v Excluded"
                    open={clause.excluded.length > 0}
                >
                    <div className="px-2">
                        {clause.excluded.length === 0 &&
                            <div>No excluded terms</div>
                        }
                        {clause.excluded.map((t) =>
                            <div key={t.name}>{t.name}</div>
                        )}
                    </div>
                </Collapsible>
            </div>
        </div>
    )
}