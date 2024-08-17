import { Clause, Connection } from "./satclasses";
import { getTermString } from "./satutils";

export function RenderClauses({ clauses, handleClick }: { clauses: Clause[], handleClick: (clause: Clause) => void }) {

    clauses.sort((a, b) => b.length - a.length);

    const cols = clauses.length > 0 ? clauses[0].length : 0;
    clauses.reverse();
    return (
        <div className="flex justify-items">
            {Array(cols).fill(1).map((value, i) =>
                <div key={i}>
                    <div key={i} className="p-2">Length {i + 1}</div>
                    {clauses.filter((clause) => clause.length === i + 1).map((clause, i) =>
                        <div key={i}>
                            <button key={clause.id + i} className="m-2 p-2 outline rounded" onClick={() => handleClick(clause)}>
                                <div>Name: {clause.name}</div>
                                <div>{getTermString(clause)}</div>
                                {/* <div>
                                    {Array.from(clause.knownTerms).map((term, i) =>
                                        <p>{getTermString(clause)}</p>
                                    )}
                                </div> */}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>);
}

export function RenderClause({ clause }: { clause: Clause }) {
    return (<>{JSON.stringify(clause)}</>);
}

export function RenderConnection({ connection }: { connection: Connection }) {
    return (<>{JSON.stringify(connection)}</>);
}
