'use client';

import { combineClauses, negateTerm, ReadClause, uniqueClauses, validProcess } from "./clauses";
import { useState } from "react";
import { CreateClauseModal, EditClauseModal } from "./modals";
import { Clause } from "./clauses";

export default function Sat() {
    const [showModal, setShowModal] = useState('');
    const [clauses, setClauses] = useState<Clause[]>([]);
    const [pendingClause, setPendingClause] = useState<Clause>();
    const [procClauses, setProcClauses] = useState<Clause[]>([]);
    const [procReady, setProcReady] = useState(false);

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

    function toggleProcClause(clause: Clause) {
        if (procClauses.includes(clause)) {
            setProcClauses([...procClauses.filter((c) => c.id !== clause.id)]);
            setProcReady(false);
        } else {
            setProcClauses([...procClauses, clause]);
            setProcReady(true);
        }
    }

    function processClauses() {
        var newClauses: Clause[] = [];
        procClauses.forEach((clause1) => {
            procClauses.forEach((clause2) => {
                if (validProcess(clause1, clause2)) {
                    newClauses.push(combineClauses(clause1, clause2));
                }
            })
        });
        setClauses(uniqueClauses([...clauses, ...newClauses]));
    }

    return (
        <div className="p-2">
        <p>This is a page for 3SAT shenanigans</p>
        <p>TODO:</p>
        <ul className="list-disc list-inside">
            <li>General clause stuff (unknown length, term path analysis)</li>
            <li>Export and import instance</li>
            <li>Add clause count</li>
            <li>Separate derived and given clauses</li>
            <li>Process all button</li>
            <li>Make knownTerms a set</li>
        </ul>
        <p>Done:</p>
        <ul className="list-disc list-inside">
            <li>Click two clauses to combine them</li>
            <li>Add and Display clause</li>
            <li>CRUD operations on clauses</li>
            <li>Copy clause</li>
            <li>Clean up knownTerms (trim, remove empty, etc)</li>
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
                <button onClick={() => toggleProcClause(clause)}>
                <ReadClause 
                    clause={clause}
                    selected={procClauses.includes(clause)}
                />
                </button>
                <button 
                    className="rounded border border-black px-1 mx-1"
                    onClick={() => {
                        setPendingClause(clauses.filter((c) => c.id === clause.id)[0]);
                        setShowModal('EditClause');
                }}>Edit</button>
            </li>
            )}
        </ul>
        {procReady &&
        <button onClick={processClauses} className="rounded border-2 border-black p-2 hover:bg-gray-400">PROCESS</button>
        }
        </div>
    );
}