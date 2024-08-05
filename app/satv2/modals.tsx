import { Dispatch, SetStateAction, useState } from "react";
import { Clause, Connection, Expansion, Implication, Instance, TermSet } from "./satclasses";

export function EditClauseModal({ clause, close, instance }: { clause: Clause, close: () => void, instance: Instance }) {

    const [, forceUpdate] = useState(0);
    const [tempClause, setTempClause] = useState(clause.copy());

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log('setting clause ' + JSON.stringify(clause) + " to temp clause " + JSON.stringify(tempClause));
        clause.update(tempClause);
        close();
    }

    function handleDelete(event: React.FormEvent) {
        instance.clauses = [...instance.clauses.filter((c) => c.id !== clause.id)];
        close();
        // TODO handle connections
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black rounded outline outline-2 outline-black-50 relative max-w-xl min-w-content min-h-1/3">
                <div className="justify-between flex w-full p-2 h-1/6">
                    <div className="">Edit Clause</div>
                    <button onClick={close}>Close</button>
                    {/* <div className="flex flex-col justify-items">
                <button onClick={close} className="peer">Close</button>
                <div className="peer-hover:animate-fadeInUnderline peer-hover:border-b-2 border-b-2 border-button-hover peer-hover:border-black"></div>
            </div> */}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="px-4">
                        {/* Name */}
                        <div className="py-2">
                            <div>Name</div>
                            <input
                                className="rounded-lg pl-1"
                                name="clauseName"
                                type="text"
                                defaultValue={clause.name}
                                autoComplete="off"
                                onChange={(e) => tempClause.name = e.target.value}
                            />
                        </div>
                        {/* Length */}
                        <div className="py-2">
                            <div>Length</div>
                            <input
                                className="rounded-lg pl-1"
                                name="length"
                                type="number"
                                defaultValue={clause.length}
                                autoComplete="off"
                                onChange={(e) => { if (e.target.value) { tempClause.length = Number.parseInt(e.target.value) } }}
                            />
                        </div>
                         {/* Column */}
                         <div className="py-2">
                            <div>Column</div>
                            <input
                                className="rounded-lg pl-1"
                                name="column"
                                type="number"
                                defaultValue={clause.col}
                                autoComplete="off"
                                onChange={(e) => { if (e.target.value) { tempClause.col = Number.parseInt(e.target.value) } }}
                            />
                        </div>
                        {/* Known Terms */}
                        <div className="py-2">
                            <div>Known Terms</div>
                            <div className="grid grid-cols-2">
                                <div>Name</div>
                                <div>Length</div>
                            </div>
                            {Array.from(tempClause.knownTerms).toSorted().map((termSet, i) =>
                                <div key={i} className="grid grid-cols-2">
                                    <input
                                        className="rounded mr-2 pl-2 w-16 my-1"
                                        name={termSet.id}
                                        type="text"
                                        defaultValue={termSet.name}
                                        autoComplete="off"
                                        key={termSet.id}
                                        onChange={(e) => { tempClause.getTermSet(termSet.id)!.name = e.target.value; console.log('updating value ' + e.target.value) }}
                                    />
                                    <div>
                                        <input
                                            className="rounded pl-2 w-16 my-1"
                                            name={termSet.id + termSet.length}
                                            type="text"
                                            defaultValue={termSet.length}
                                            autoComplete="off"
                                            key={termSet.id + termSet.length}
                                        />
                                        <button type="button" className="rounded-xl outline px-2 ml-2" onClick={() => { tempClause.knownTerms.delete(termSet); forceUpdate((n) => n + 1); console.log('removing tset ' + termSet.id) }}>-</button>
                                    </div>
                                </div>
                            )}

                            <button className="rounded-xl outline px-2 mt-2" onClick={() => { tempClause.addTerm(instance, tempClause.getTermNames()); forceUpdate((n) => n + 1) }} type="button">+</button>
                        </div>
                    </div>
                    <div className="flex p-2">
                        <button
                            className="p-2 rounded hover:bg-button-hover"
                            type="submit"
                        >Submit</button>
                        <button
                            className="p-2 rounded hover:bg-button-hover"
                            onClick={handleDelete}
                            type="button"
                        >Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ControlsModal({ close }: { close: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black rounded outline outline-2 outline-black-50 relative max-w-xl w-1/3 min-h-1/3">
                <div className="justify-between flex w-full p-2 h-1/6">
                    <div className="">Help & Controls</div>
                    <button onClick={close}>Close</button>
                    {/* <div className="flex flex-col justify-items">
                <button onClick={close} className="peer">Close</button>
                <div className="peer-hover:animate-fadeInUnderline peer-hover:border-b-2 border-b-2 border-button-hover peer-hover:border-black"></div>
            </div> */}
                </div>
                <div className="p-2 grid grid-cols-[20%_auto]">
                    <div>h</div>
                    <div>Help<br />Open this help modal</div>
                    <div>n</div>
                    <div>Creates a new 3-t clause</div>
                    <div>e</div>
                    <div>Enter edit mode<br />Select a clause to edit it</div>
                    <div>Shift</div>
                    <div>Enter expansion mode<br />Select clause1 then clause2 to add an expansion connection from clause1 to clause2</div>
                    <div>Control</div>
                    <div>Enter implication mode<br />Select clause1 then clause2 then clause3 to add an implication connection such that clause1 and clause2 share an opposite form term and output clause3</div>
                    {/* <div>Export/ Import</div>
                    <div>Export or import the current instance in json format</div>
                    <div>Copy Instance</div>
                    <div>Create a new instance based on the current one</div>
                    <div className="text-sm">Process Expansion</div>
                    <div>(In progress) Add new instances based on possible term paths</div> */}
                </div>
            </div>
        </div>
    );
}