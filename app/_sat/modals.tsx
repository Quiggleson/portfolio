'use client';
import { useState } from "react";
import { Clause } from "./clauses";

export function CreateClauseModal({ onClose, onAdd }: { onClose: () => void, onAdd: (clause: Clause) => void }) {
    const [name, setName] = useState('');
    const [length, setLength] = useState(0);
    const [knownTerms, setKnownTerms] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ name, length, knownTerms });
        var terms = knownTerms.split(',').map((term, i) => term.trim()).filter((term) => term.length > 0);
        onAdd({ id: crypto.randomUUID(), name, length: length, knownTerms: terms });
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded outline outline-2 outline-black-50 p-20 bg-purple-com relative">
                <p className="absolute top-0 mt-5 ml-2">Add Clause</p>
                <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2">X</button>
                <form onSubmit={handleSubmit} className="">
                    <div className="p-2">
                        <label htmlFor="name" className="block">Name</label>
                        <input
                            className="rounded pl-1"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="p-2">
                        <label htmlFor="length" className="block">Length</label>
                        <input
                            className="rounded pl-1"
                            id="length"
                            type="number"
                            value={length}
                            onChange={(e) => setLength(e.target.valueAsNumber)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="p-2">
                        <label htmlFor="knownTerms" className="block">Known Terms</label>
                        <input
                            className="rounded pl-1"
                            id="knownTerms"
                            type="text"
                            value={knownTerms}
                            onChange={(e) => setKnownTerms(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="px-5 p-2 hover:bg-purple-hover w-fit border rounded border-black">SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function EditClauseModal({ onClose, onEdit, onDelete, onAdd, clause }
    : {
        onClose: () => void,
        onEdit: (clause: Clause) => void,
        onDelete: (clause: Clause) => void,
        onAdd: (clause: Clause) => void,
        clause: Clause | undefined
    }) {

    if (clause === undefined) {
        onClose();
        clause = { id: "", name: "", length: 1, knownTerms: [""] }
    }

    var knownTermStr = '';

    clause.knownTerms.forEach((term, i) => {
        knownTermStr += term;
        if (i !== clause.knownTerms.length - 1) { knownTermStr += ', ' };
    })

    const [name, setName] = useState(clause.name);
    const [length, setLength] = useState(clause.length);
    const [knownTerms, setKnownTerms] = useState(knownTermStr);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ name, length, knownTerms });
        var terms = knownTerms.split(',').map((term, i) => term.trim()).filter((term) => term.length > 0);
        onEdit({ id: clause.id, name: name, length: length, knownTerms: terms });
        onClose();
    }

    const handleDelete = (event: React.FormEvent) => {
        event.preventDefault();
        onDelete(clause);
        onClose();
    }

    const handleCopy = (event: React.FormEvent) => {
        event.preventDefault();
        onAdd({ id: crypto.randomUUID(), name: clause.name, length: clause.length, knownTerms: clause.knownTerms });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded outline outline-2 outline-black-50 p-20 bg-purple-com relative">
                <p className="absolute top-0 mt-5 ml-2">Edit Clause</p>
                <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2">X</button>
                <form onSubmit={handleSubmit} className="">
                    <div className="p-2">
                        <label htmlFor="name" className="block">Name</label>
                        <input
                            className="rounded pl-1"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="p-2">
                        <label htmlFor="length" className="block">Length</label>
                        <input
                            className="rounded pl-1"
                            id="length"
                            type="number"
                            value={length}
                            onChange={(e) => setLength(e.target.valueAsNumber)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="p-2">
                        <label htmlFor="knownTerms" className="block">Known Terms</label>
                        <input
                            className="rounded pl-1"
                            id="knownTerms"
                            type="text"
                            value={knownTerms}
                            onChange={(e) => setKnownTerms(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-between p-2">
                        <button type="submit" className="px-5 p-2 hover:bg-purple-hover w-fit border rounded border-black">SUBMIT</button>
                        <button onClick={handleDelete} className="px-5 p-2 hover:bg-purple-hover w-fit border rounded border-black">DELETE</button>
                        <button onClick={handleCopy} className="px-5 p-2 hover:bg-purple-hover w-fit border rounded border-black">COPY</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ControlsModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded outline outline-2 outline-black-50 p-5 bg-purple-com">
                <div className="max-w-sm">
                        <div className="flex justify-between">
                        <p className="mr-10">Help & Controls</p>
                        <button onClick={onClose} className="">X</button>
                        </div>
                    <br />
                    <p>Prepend relevant command with a number, i,  to repeat that command i times</p>
                    <div className="grid grid-cols-[max-content_auto]">
                            <p className="pr-5">[n]</p>
                            <p>Add new 3-t clause <br/>It will iterate terms by lowercase letter, appending an additional letter after reaching z. Ex/ &quot;a&quot;, &quot;b&quot;, ... &quot;z&quot;, &quot;aa&quot;, &quot;ab&quot;, ...</p>
                            <p className="pr-5">[f]</p>
                            <p>Format clauses <br />Draw relations from parent clauses on the left to child clauses on the right</p>
                            <p className="pr-5">[:e]</p>
                            <p>Export <br />Export clauses as json data</p>
                            <p className="pr-5">[:l]</p>
                            <p>Load <br />Load json data</p>
                            <p className="pr-5">[:ni]</p>
                            <p>New i-terminal clause <br />Add new clause of length i</p>
                        <div className="mr-5 font-mono text-nowrap">
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}