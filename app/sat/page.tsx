'use client';

import { combineClauses, negateTerm, ReadClause, RenderLines, uniqueClauses, validProcess } from "./clauses";
import { useState, useEffect, useRef } from "react";
import { CreateClauseModal, EditClauseModal } from "./modals";
import { Clause } from "./clauses";
import Draggable from "react-draggable";

export default function Sat() {
    const [showModal, setShowModal] = useState('');
    const [clauses, setClauses] = useState<Clause[]>([]);
    const [pendingClause, setPendingClause] = useState<Clause>();
    const [procClauses, setProcClauses] = useState<Clause[]>([]);
    const [procReady, setProcReady] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // parents: [child, parent, parent]
    const [families, setFamilies] = useState<{parent1: Clause, parent2: Clause, child: Clause}[]>([]);

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
        if (!isDragging) {
            if (procClauses.includes(clause)) {
                setProcClauses([...procClauses.filter((c) => c.id !== clause.id)]);
                setProcReady(false);
            } else {
                setProcClauses([...procClauses, clause]);
                setProcReady(true);
            }
        }
    }

    function processClauses() {
        var newClauses: Clause[] = [];
        var newFamilies: {parent1: Clause, parent2: Clause, child: Clause}[] = []
        procClauses.forEach((clause1) => {
            procClauses.forEach((clause2) => {
                if (clause1 !== clause2 && validProcess(clause1, clause2)) {
                    const newClause = combineClauses(clause1, clause2);
                    newClauses.push(newClause);
                    newFamilies.push({parent1: clause1, parent2: clause2, child: newClause});
                }
            })
        });
        const unique = uniqueClauses([...clauses, ...newClauses]);
        setClauses(unique);
        setFamilies([...families, ...newFamilies.filter((family) => unique.includes(family.parent1) && unique.includes(family.parent2) && unique.includes(family.child))])
    }

    function handleStart() {
        console.log('handle start');
        setTimeout(() => {
            setIsDragging(true);
        }, 100);
    }

    function handleStop() {
        console.log('handle stop');
        setTimeout(() => {
            setIsDragging(false);
        }, 100);
    }

    return (
        <div className="p-2 relative h-screen">
        <p>This is a page for 3SAT shenanigans</p>
        <p>TODO:</p>
        <ul className="list-disc list-inside">
            <li>Clean up arrows</li>
            <li>General clause stuff (unknown length, term path analysis)</li>
            <li>Export and import instance</li>
            <li>Add clause count</li>
            <li>Separate derived and given clauses</li>
            <li>Process all button</li>
            <li>Make knownTerms a set</li>
        </ul>
        <p>Done:</p>
        <ul className="list-disc list-inside">
            <li>Lines</li>
            <li>Drag clauses</li>
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
                <Draggable
                    onStart={handleStart}
                    onStop={handleStop}
                >
                    <div id={clause.id}>
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
                    </div>
                </Draggable>
            </li>
            )}
        </ul>
        {procReady &&
        <button onClick={processClauses} className="rounded border-2 border-black p-2 hover:bg-gray-400">PROCESS</button>
        }
        <RenderLines 
            families={families}
        />
        </div>
    );
}