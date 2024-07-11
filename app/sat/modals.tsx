'use client';
import { useState } from "react";
import { Clause } from "./clauses";

export function CreateClauseModal({onClose, onAdd}: {onClose: () => void, onAdd: (clause: Clause) => void}) {
    const [name, setName] = useState('');
    const [length, setLength] = useState(0);
    const [knownTerms, setKnownTerms] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ name, length, knownTerms});
        onAdd({name: name, length: length, knownTerms: knownTerms.split(',')});
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded outline outline-2 outline-black-50 p-20 bg-blue-400 relative">
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
                        <button type="submit" className="px-5 p-2 hover:bg-sky-700 w-fit border rounded border-black">SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function EditClauseModal({onClose, onSubmit, clause}
    : {
        onClose: () => void, 
        onSubmit: (clause: Clause) => void, 
        clause: Clause | undefined
    }) {
    
    if (clause === undefined) {
        return (<p>[ERROR] Clause is undefined</p>);
    }

    var knownTermStr = '';

    clause.knownTerms.forEach((term) => {
        knownTermStr += term + ',';
    })

    const [name, setName] = useState(clause.name);
    const [length, setLength] = useState(clause.length);
    const [knownTerms, setKnownTerms] = useState(knownTermStr);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ name, length, knownTerms});
        onSubmit({name: name, length: length, knownTerms: knownTerms.split(',')});
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="rounded outline outline-2 outline-black-50 p-20 bg-blue-400 relative">
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
                    <div className="flex justify-center">
                        <button type="submit" className="px-5 p-2 hover:bg-sky-700 w-fit border rounded border-black">SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    );
}