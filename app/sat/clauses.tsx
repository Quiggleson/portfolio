'use client';

import { CreateClauseModal } from "./modals";

// Components for creating, reading, updating, and deleting a clause

// Opens create clause modal
export function CreateClause() {
    return (<button onClick={() => CreateClauseModal}>I'm a button!</button>);
}

// Displays the clause
export function ReadClause({ clauseName, length, knownTerms}: {clauseName: string, length: number, knownTerms: string}) {
    return (
        <div className="bg-gray-100 rounded border w-fit">
            <span className="p-2">Name: {clauseName}</span>
            <span className="p-2">Length: {length}</span>
            <span className="p-2">Known Terms: {knownTerms}</span>
        </div>
    );
}

// Opens edit clause modal
function EditClause() {

}

// Opens confirmation modal
function DeleteClause() {

}
