import { Clause, Implication } from "./satclasses";

export function createClause(name: string | undefined, length: number, knownTerms: string[], clauses: Clause[]) {
    const newName = name === undefined ? getNextName(clauses) : name;
    return new Clause(length, new Set(knownTerms), newName);
}

function getNextName(clauses: Clause[]) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var i = 0;
    var takenNames = new Set<string>();
    clauses.forEach((clause) => {
        takenNames.add(clause.name);
    });
    while (i < 26 && takenNames.has(alphabet[i])) {i++};
    return i === 26 ? 'A' : alphabet[i];
}

// Return human readable list of terms
export function getTermString(clause: Clause) {
    var knownTermStr = '';

    Array.from(clause.knownTerms).forEach((term, i) => {
        knownTermStr += term;
        if (i !== clause.knownTerms.size - 1) { knownTermStr += ', ' };
    })
    return knownTermStr;
}

// Return set from human readable list of terms
export function getTermSet(termString: string) {
    var knownTerms = new Set<string>();

    termString.split(',').forEach((term) => {
        const t = term.trim().replace(',','');
        if (t.length > 0) {
            knownTerms.add(t);
        }
    })

    return knownTerms;
}