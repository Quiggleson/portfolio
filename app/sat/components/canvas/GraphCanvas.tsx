'use client'

import { ClauseData, ExpansionData, ImplicationData, InstanceGetter } from "@/app/types/graph"
import { getInstanceAttribute, getInstanceData } from "@/app/actions/instanceHelper"
import { useGraphStore } from "@/app/store/useGraphStore"
import { DrawExpansion, DrawImplication } from "../../utils/DrawEdges"
import ClauseCanvas from "./ClauseCanvas"
import { useEffect, useRef, useState } from "react"
import Draggable from "react-draggable"

export function GraphCanvas() {

    const [clauses, setClauses] = useState<ClauseData[]>([])
    const [expansions, setExpansions] = useState<ExpansionData[]>([])
    const [implications, setImplications] = useState<ImplicationData[]>([])
    const [edgeVersion, setEdgeVersion] = useState<number>(0)

    const hiddenClauses = useGraphStore((state) => state.hiddenClauses)
    const hiddenExpansions = useGraphStore((state) => state.hiddenExpansions)
    const hiddenImplications = useGraphStore((state) => state.hiddenImplications)
    const refreshVersion = useGraphStore((state) => state.refreshVersion)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const refresh = async () => {
            const instance = await getInstanceData()
            const allClauses = await getInstanceAttribute(InstanceGetter.clauses)
            const allExpansions = instance.expansions
            const allImplications = instance.implications

            const newExpansions = allExpansions.filter((e) => !hiddenExpansions.has(e.id))
            const newImplications = allImplications.filter((i) => !hiddenImplications.has(i.id))
            setClauses(allClauses)
            setExpansions(newExpansions)
            setImplications(newImplications)
        }

        refresh()
    }, [refreshVersion, hiddenExpansions, hiddenImplications])

    useEffect(() => {

        const drawEdges = () => {

            const canvas = canvasRef.current
            const ctx = canvas?.getContext('2d')
            if (!canvas || !ctx || !containerRef.current) {
                return
            }

            const rect = containerRef.current.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height

            const canvasRect = canvas.getBoundingClientRect()

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 2

            for (let expansion of expansions) {
                const fromId = expansion.input.id
                const toId = expansion.output.id

                if (hiddenClauses.has(fromId)) continue
                if (hiddenClauses.has(toId)) continue

                const fromEl = document.getElementById(fromId)
                const toEl = document.getElementById(toId)

                DrawExpansion(ctx, canvasRect, fromEl, toEl)
            }

            for (let implication of implications) {
                const aId = implication.input[0].id
                const bId = implication.input[1].id
                const toId = implication.output.id

                if (hiddenClauses.has(aId)) continue
                if (hiddenClauses.has(bId)) continue
                if (hiddenClauses.has(toId)) continue

                const aEl = document.getElementById(aId)
                const bEl = document.getElementById(bId)
                const toEl = document.getElementById(toId)

                DrawImplication(ctx, canvasRect, aEl, bEl, toEl)
            }
        }

        drawEdges()
    }, [expansions, implications, edgeVersion, hiddenClauses])


    const handleDrag = () => {
        setEdgeVersion(edgeVersion + 1)
    }

    return (
        <div ref={containerRef} className="relative w-full h-full ml-2">
            <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none" />
            {clauses.map(clause => (
                <div
                    key={clause.id}
                    className={"w-fit " + (hiddenClauses.has(clause.id) ? "invisible" : "")}
                >
                    <Draggable
                        onDrag={handleDrag}
                        defaultClassName="absolute"
                    >
                        <div
                            id={clause.id}
                        >
                            <ClauseCanvas key={clause.name} clause={clause} />
                        </div>
                    </Draggable>
                </div>
            ))}
        </div>
    )
}