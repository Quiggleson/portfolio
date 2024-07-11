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
        setClauses(
            [
                ...clauses.filter((c) => c.id !== clause.id),
                clause
            ]
        );
    }

    function DeleteClause(clause: Clause) {
        setClauses(
            [
                ...clauses.filter((c) => c.id !== clause.id)
            ]
        );
    }

    return (
        <div className="p-2">
        <p>This is a page for 3SAT shenanigans</p>
        <p>TODO:</p>
        <ul className="list-disc list-inside">
            <li>Clean up knownTerms (trim, remove empty, etc)</li>
            <li>Click two clauses to combine them</li>
            <li>General clause stuff (unknown length, term path analysis)</li>
            <li>Export and import instance</li>
            <li>Add clause count</li>
            <li>Separate derived and given clauses</li>
            <li>Process all button</li>
        </ul>
        <p>Done:</p>
        <ul className="list-disc list-inside">
            <li>Add and Display clause</li>
            <li>CRUD operations on clauses</li>
            <li>Copy clause</li>
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
            onEdit={EditClause}
            onAdd={addClause}
            onDelete={DeleteClause}
            clause={pendingClause}
        />
        }
        <br />
        <ul className="list-disc">
            {clauses.map((clause, i) => 
            <li key={clause.id} className="p-2 flex">
                <ReadClause 
                    clause={clause}
                />
                <div className="my-auto">
                    <button 
                        className="rounded border border-black px-1 mx-1"
                        onClick={() => {
                            setPendingClause(clauses.filter((c) => c.id === clause.id)[0]);
                            setShowModal('EditClause');
                    }}>Edit</button>
                </div>
            </li>
            )}
        </ul>
        </div>
    );
}