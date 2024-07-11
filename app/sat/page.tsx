'use client';

import { ReadClause } from "./clauses";
import { useState } from "react";
import { CreateClauseModal, EditClauseModal } from "./modals";
import { Clause } from "./clauses";

export default function Sat() {
    const [showModal, setShowModal] = useState('');
    const [clauses, setClauses] = useState<Clause[]>([]);
    const [pendingClause, setPendingClause] = useState<Clause>();

    function addClause(clause: Clause) {
        setClauses(
            [
                ...clauses,
                clause,
            ]
        );
    };

    function EditClause(clause: Clause) {

    }

    return (
        <div className="p-2">
        <p>This is a page for 3SAT shenanigans</p>
        <p>TODO:</p>
        <ul className="list-disc list-inside">
            <li>CRUD operations on clauses</li>
            <li>Click two clauses to combine them</li>
            <li>General clause stuff (unkown length, term path analysis)</li>
            <li>Export and import instance</li>
        </ul>
        <p>Done:</p>
        <ul className="list-disc list-inside">
            <li>Add and Display clause</li>
        </ul>
        <br />
        <button onClick={() => setShowModal('CreateClause')} className="p-1 outline rounded hover:bg-gray-100">Add clause</button>
        {showModal === 'CreateClause' &&
        <CreateClauseModal 
            onClose={() => setShowModal('')}
            onAdd={addClause}    
        />
        }
        {showModal === 'EditClause' &&
        <EditClauseModal 
            onClose={() => setShowModal('')}
            onSubmit={EditClause}
            clause={pendingClause}
        />
        }
        <br />
        <ul className="list-disc">
            {clauses.map((clause, i) => 
            <li key={"clause_"+i} className="p-2 flex">
                <ReadClause 
                    clause={clause}
                />
                <div className="my-auto">
                    <button 
                        className="rounded border border-black px-1 mx-1"
                        onClick={() => {
                            setPendingClause({name: clause.name, length: clause.length, knownTerms: clause.knownTerms});
                            setShowModal('EditClause');
                    }}>Edit</button>
                </div>
            </li>
            )}
        </ul>
        </div>
    );
}