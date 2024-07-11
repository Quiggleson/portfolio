'use client';

import { CreateClauseModal } from "./modals";

// Components for creating, reading, updating, and deleting a clause

// Opens create clause modal
export function CreateClause() {
    return (<button onClick={() => CreateClauseModal}>I am a button!</button>);
}

// Displays the clause
export function ReadClause({ clause }: {clause: Clause}) {
    return (
        <div className="bg-gray-100 rounded border w-fit">
            <span className="p-2">Name: {clause.name}</span>
            <span className="p-2">Length: {clause.length}</span>
            <span className="p-2">Known Terms:</span>
            {clause.knownTerms.map((term, i) => <>{term+","}</>)}
            <span className="px-1"></span>
        </div>
    );
}

// Opens edit clause modal
function EditClause() {

}

// Opens confirmation modal
function DeleteClause() {

}

export interface Clause {
    name: string,
    length: number,
    knownTerms: string[]
}