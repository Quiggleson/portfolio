'use client';

import { ReadClause } from "./clauses";
import { useState } from "react";
import { CreateClauseModal } from "./modals";

import './sat.css';

export default function Sat() {
    const [showModal, setShowModal] = useState(false);
    const [clauses, setClauses] = useState<{name: string, length: number, knownTerms: string}[]>([]);

    function addClause(name: string, length: number, knownTerms: string) {
        setClauses(
            [
                ...clauses,
                {name: name, length: length, knownTerms: knownTerms},
            ]
        );
    };

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
        <button onClick={() => setShowModal(true)} className="p-1 outline rounded hover:bg-gray-100">Add clause</button>
        {showModal &&
        <CreateClauseModal 
            onClose={() => setShowModal(false)}
            onAdd={addClause}    
        />
        }
        <br />
        <ul className="list-disc">
            {clauses.map((clause, i) => 
            <li key={"clause_"+i} className="p-2">
                <ReadClause 
                    clauseName={clause.name}
                    length={clause.length}
                    knownTerms={clause.knownTerms}
                />
            </li>
            )}
        </ul>
        </div>
    );
}