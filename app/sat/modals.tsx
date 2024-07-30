import { Dispatch, SetStateAction } from "react";
import { Clause, Connection, Expansion, Implication } from "./satclasses";
import { getTermSet, getTermString } from "./satutils";

export function EditClauseModal({ clause, close, clauses, setClauses, connections, setConnections }: { clause: Clause, close: () => void, clauses: Clause[], setClauses: Dispatch<SetStateAction<Clause[]>>, connections: Connection[], setConnections: Dispatch<SetStateAction<Connection[]>>}) {

    function handleSubmit(formData: FormData) {
        clause.name = formData.get('name') === undefined ? clause.name : formData.get('name')!.toString();
        clause.length = formData.get('length') === undefined ? clause.length : Number.parseInt(formData.get('length')!.toString());
        clause.knownTerms = formData.get('knownTerms') === undefined ? clause.knownTerms : getTermSet(formData.get('knownTerms')!.toString());
        close();
    }

    function handleDelete(event: React.FormEvent) {
        setClauses(clauses.filter((c) => c.id !== clause.id));
        setConnections(connections.filter((connection) => !connection.getClauses().includes(clause)));
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded outline outline-2 outline-black-50 bg-purple-com relative max-w-xl min-w-content min-h-1/3">
                <div className="justify-between flex w-full p-2 h-1/6 bg-purple-light">
                    <div className="">Edit Clause</div>
                    <button onClick={close}>Close</button>
                    {/* <div className="flex flex-col justify-items">
                <button onClick={close} className="peer">Close</button>
                <div className="peer-hover:animate-fadeInUnderline peer-hover:border-b-2 border-b-2 border-purple-light peer-hover:border-black"></div>
            </div> */}
                </div>
                <form action={handleSubmit}>
                    <div className="px-4">
                        {/* Name */}
                        <div className="py-2">
                            <div>Name</div>
                            <input
                                className="rounded-lg pl-1"
                                name="name"
                                type="text"
                                defaultValue={clause.name}
                                autoComplete="off"
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
                            />
                        </div>
                        {/* Known Terms */}
                        <div className="py-2">
                            <div>Known Terms</div>
                            <input
                                className="rounded-lg pl-1"
                                name="knownTerms"
                                type="text"
                                defaultValue={getTermString(clause)}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="flex p-2">
                        <button
                            className="p-2 rounded hover:bg-purple-light"
                            type="submit"
                        >Submit</button>
                        <button 
                            className="p-2 rounded hover:bg-purple-light"
                            onClick={handleDelete}
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
            <div className="rounded outline outline-2 outline-black-50 bg-purple-com relative max-w-xl w-1/3 min-h-1/3">
                <div className="justify-between flex w-full p-2 h-1/6 bg-purple-light">
                    <div className="">Help & Controls</div>
                    <button onClick={close}>Close</button>
                    {/* <div className="flex flex-col justify-items">
                <button onClick={close} className="peer">Close</button>
                <div className="peer-hover:animate-fadeInUnderline peer-hover:border-b-2 border-b-2 border-purple-light peer-hover:border-black"></div>
            </div> */}
                </div>
                <div className="p-2 grid grid-cols-[20%_auto]">
                    <div>h</div>
                    <div>Help<br />Open this help modal</div>
                    <div>n</div>
                    <div>Creates a new 3-t clause</div>
                    <div>c</div>
                    <div>(while held) Copy<br />Copy selected clause</div>
                    <div>e</div>
                    <div>(while held) Enter edit mode<br />Select a clause to edit it</div>
                    <div>t</div>
                    <div>(While held) Enter new term mode<br />Click a clause to add a new term</div>
                    <div>Shift</div>
                    <div>(while held) Enter expansion mode<br />Select clause1 then clause2 to add an expansion connection from clause1 to clause2</div>
                    <div>Control</div>
                    <div>(while held) Enter implication mode<br />Select clause1 then clause2 then clause3 to add an implication connection such that clause1 and clause2 share an opposite form term and output clause3</div>
                    <div>Export/ Import</div>
                    <div>Export or import the current instance in json format</div>
                    <div>Copy Instance</div>
                    <div>Create a new instance based on the current one</div>
                    <div className="text-sm">Process Expansion</div>
                    <div>(In progress) Add new instances based on possible term paths</div>
                </div>
            </div>
        </div>
    );
}