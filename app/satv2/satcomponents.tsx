import { useState } from "react";
import { Clause, Connection, ConnectionType, Expansion, Implication } from "./satclasses";
import { getTermString } from "./satutils";

export function RenderClauses({ clauses, handleClick }: { clauses: Clause[], handleClick: (clause: Clause) => void }) {

    clauses.sort((a, b) => b.col - a.col);

    const cols = clauses.length > 0 ? clauses[0].col + 1 : 0;
    clauses.reverse();
    return (
        <div className="flex justify-items">
            {Array(cols).fill(1).map((value, i) =>
                <div key={i}>
                    <div key={i} className="p-2">Column {i}</div>
                    {clauses.sort((a, b) => a.name.localeCompare(b.name)).filter((clause) => clause.col === i).map((clause, i) =>
                        <div key={i}>
                            <button id={clause.id} key={clause.id + i} className="m-2 p-2 outline rounded" onClick={() => handleClick(clause)}>
                                <div>Name: {clause.name}</div>
                                <div>{getTermString(clause.unknown)}</div>
                                <div>Known:</div>
                                {Array.from(clause.known).map((term, i) => (
                                    <span key={term.id}>{term.name+" "}</span>
                                ))}
                                <div>Placed</div>
                                {Array.from(clause.unknown).map((unk, i) => (
                                    Array.from(unk.known).map((kno, j) => (
                                        <span key={i+"_"+j}>{kno.name+" "} &isin; {" " + unk.name + " "}</span>
                                    ))
                                ))}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>);
}

export function RenderConnections({ connections }: { connections: Connection[] }) {

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
            className="stroke-button-hover stroke-2"
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

    return (
        <>
            <line
                className="stroke-button-hover stroke-2"
                x1={positive.right}
                y1={(positive.top + positive.bottom) / 2}
                x2={(positive.right + output.left) / 2}
                y2={(positive.top + positive.bottom) / 2}
            />
            <line
                className="stroke-button-hover stroke-2"
                x1={negative.right}
                y1={(negative.top + negative.bottom) / 2}
                x2={(negative.right + output.left) / 2}
                y2={(negative.top + negative.bottom) / 2}
            />
            <line
                className="stroke-button-hover stroke-2"
                x1={(positive.right + output.left) / 2}
                y1={(positive.top + positive.bottom) / 2}
                x2={output.left}
                y2={(positive.top + positive.bottom) / 2}
            />
            <line
                className="stroke-button-hover stroke-2"
                x1={(positive.right + output.left) / 2}
                y1={(positive.top + positive.bottom) / 2}
                x2={(positive.right + output.left) / 2}
                y2={(negative.top + negative.bottom) / 2}
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
