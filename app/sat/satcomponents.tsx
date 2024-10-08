'use client';

import { useState } from "react";
import { Clause, Connection, ConnectionType, Expansion, Implication, Instance } from "./satclasses";
import { getTermString } from "./satutils";
import Draggable from "react-draggable";

export function RenderClauses({ clauses, handleClick }: { clauses: Clause[], handleClick: (clause: Clause) => void }) {

    const [dragging, setDragging] = useState<Clause>();
    const [hovering, setHovering] = useState(-1);

    clauses.sort((a, b) => b.col - a.col);
    const cols = clauses.length > 0 ? clauses[0].col + 1 : 0;
    clauses.reverse();

    const checkHovering = (clause: Clause) => {
        console.log('checking hovering');
        const el = document.getElementById(clause.id)?.getBoundingClientRect();
        if (el) {
            const clausemidx = (el.left + el.right)/2;
            const clausemidy = (el.top + el.bottom)/2;
            Array(cols).forEach((a, i) => {
                const div = document.getElementById(i.toString())?.getBoundingClientRect();
                if (div && clausemidx > div.left && clausemidx < div.right && clausemidy > div.top && clausemidy < div.bottom) {
                    setHovering(i);
                }
            })
        }
    }

    return (
        <div className="flex justify-items">
            {Array(cols).fill(1).map((value, i) =>
                <div key={i}>
                    <div key={i} className="p-2">Column {i}</div>
                    {clauses.sort((a, b) => a.name.localeCompare(b.name)).filter((clause) => clause.col === i).map((clause, i) =>
                        <div key={i} className={dragging && hovering !== i ? "bg-slate-500 outline" : ""} id={i.toString()}>
                            <Draggable
                                onStart={() => setDragging(clause)}
                                onStop={() => setDragging(undefined)}
                                onDrag={() => checkHovering(clause)}
                            >
                                <button id={clause.id} key={clause.id + i} className="m-2 p-2 outline rounded" onClick={() => handleClick(clause)}>
                                    <div>Name: {clause.name}</div>
                                    <div>{getTermString(clause.unknown)}</div>
                                    <div>Known:</div>
                                    {Array.from(clause.known).map((term, i) => (
                                        <span key={term.id}>{term.name + " "}</span>
                                    ))}
                                    <div>Placed</div>
                                    {Array.from(clause.unknown).map((unk, i) => (
                                        Array.from(unk.known).map((kno, j) => (
                                            <span key={i + "_" + j}>{kno.name + " "} &isin; {" " + unk.name + " "}</span>
                                        ))
                                    ))}
                                    <div>Excluded</div>
                                    {Array.from(clause.excluded).map((exc, i) => (
                                        <span key={i}>{exc.name + " "}</span>
                                    ))}
                                </button>
                            </Draggable>
                        </div>
                    )}
                </div>
            )}
        </div>);
}

export function DrawConnections({ connections }: { connections: Connection[] }) {

    return (
        <svg className="fixed top-0 left-0 h-full w-full -z-10">
            {(connections.filter((c) => c.type === ConnectionType.expansion) as Expansion[]).map((expansion) => (
                <RenderExpansion
                    key={expansion.id}
                    expansion={expansion}
                />
            ))}
            {(connections.filter((c) => c.type === ConnectionType.implication) as Implication[]).map((implication) => (
                <RenderImplication
                    key={implication.id}
                    implication={implication}
                />
            ))}
        </svg>
    );
}

export function RenderExpansion({ expansion }: { expansion: Expansion }) {
    const defaultObj = { top: 0, bottom: 0, right: 0, left: 0 };
    const input = document.getElementById(expansion.input.id) ? document.getElementById(expansion.input.id)!.getBoundingClientRect() : defaultObj;
    const output = document.getElementById(expansion.output.id) ? document.getElementById(expansion.output.id)!.getBoundingClientRect() : defaultObj;

    return (
        <line
            className="stroke-line-color stroke-2"
            x1={input.right}
            y1={(input.top + input.bottom) / 2}
            x2={output.left}
            y2={(output.top + output.bottom) / 2}
            key={expansion.id}
        />
    );
}

export function RenderImplication({ implication }: { implication: Implication }) {
    const defaultObj = { top: 0, bottom: 0, right: 0, left: 0 };
    const positive = document.getElementById(implication.positive.id) ? document.getElementById(implication.positive.id)!.getBoundingClientRect() : defaultObj;
    const negative = document.getElementById(implication.negative.id) ? document.getElementById(implication.negative.id)!.getBoundingClientRect() : defaultObj;
    const output = document.getElementById(implication.output.id) ? document.getElementById(implication.output.id)!.getBoundingClientRect() : defaultObj;
    var first, second;
    if (positive.left < negative.left) {
        first = positive;
        second = negative;
    } else {
        first = negative;
        second = positive;
    }
    const bottom = Math.min((positive.bottom + positive.top) / 2, (negative.bottom + negative.top) / 2, (output.bottom + output.top) / 2);
    const top = Math.max((positive.bottom + positive.top) / 2, (negative.bottom + negative.top) / 2, (output.bottom + output.top) / 2);

    return (
        <>
            <line
                className="stroke-line-color stroke-2"
                x1={first.right}
                y1={(first.top + first.bottom) / 2}
                x2={(second.right + output.left) / 2}
                y2={(first.top + first.bottom) / 2}
            />
            <line
                className="stroke-line-color stroke-2"
                x1={second.right}
                y1={(second.top + second.bottom) / 2}
                x2={(second.right + output.left) / 2}
                y2={(second.top + second.bottom) / 2}
            />
            <line
                className="stroke-line-color stroke-2"
                x1={(second.right + output.left) / 2}
                y1={(output.top + output.bottom) / 2}
                x2={output.left}
                y2={(output.top + output.bottom) / 2}
            />
            <line
                className="stroke-line-color stroke-2"
                x1={(second.right + output.left) / 2}
                y1={top}
                x2={(second.right + output.left) / 2}
                y2={bottom}
            />
        </>
    );

}

export function RenderClause({ clause }: { clause: Clause }) {
    return (<>{JSON.stringify(clause)}</>);
}

export function RenderConnection({ connection }: { connection: Connection }) {
    return (<>{JSON.stringify(connection)}</>);
}

export function RenderConnections({ instance }: { instance: Instance }) {
    return (
        <div>
            {Array.from(instance.getImplications()).sort((a, b) => a.positive.name.localeCompare(b.positive.name)).map((c, i) =>
                <div className="pl-2 py-2" key={i}>
                    <span key={i}>{c.positive.name} + {c.negative.name} implies {c.output.name}</span>
                    <button onClick={() => instance.connections = [...instance.connections.filter(co => co.id !== c.id)]} className="outline rounded-xl px-2 mx-2">-</button>
                </div>
            )}
            {Array.from(instance.getExpansions()).sort((a, b) => a.input.name.localeCompare(b.input.name)).map((c, i) =>
                <div className="pl-2 py-2" key={i}>
                    <span key={i}>{c.input.name} expands to {c.output.name}</span>
                    <button onClick={() => instance.connections = [...instance.connections.filter(co => co.id !== c.id)]} className="outline rounded-xl px-2 mx-2">-</button>
                </div>
            )}
        </div>

    );
}
