'use client';

// Displays the clause
export function ReadClause({ clause, selected }: {clause: Clause, selected: boolean}) {
    return (
        <div className={selected ? "bg-button-hover rounded border border-black w-fit" : "bg-inherit rounded border border-black w-fit" }>
        {/* <div className="bg-gray-100 rounded border w-fit"> */}
            <span className="p-2">Name: {clause.name}</span>
            <span className="p-2">Length: {clause.length}</span>
            <span className="p-2">Known Terms:</span>
            {clause.knownTerms.map((term, i) => <span key={i}>{term}{i !== clause.knownTerms.length - 1 && ", "}</span>)}
            <span className="px-1"></span>
        </div>
    );
}

// Returns the opposite form term
export function negateTerm(term: string) {
    return term[0] === '-' ? term.substring(1) : '-' + term;
}

export function positiveTerm(term: string) {
    return term[0] === '-' ? term.substring(1) : term;
}

// Checks clauses can be combined
export function validProcess(clause1: Clause, clause2: Clause) {
    var termCount = 0;
    clause1.knownTerms.forEach((term1) => {
        if (clause2.knownTerms.includes(negateTerm(term1))) {
            termCount++;
        }
    })
    return termCount <= 1;
}

// Combines two clauses
export function combineClauses(clause1: Clause, clause2: Clause): Clause {
    if (!validProcess(clause1, clause2)) {
        throw Error('Clauses cannot be combined');
    }
    console.log("combining clauses " + JSON.stringify([clause1, clause2]))
    const term = getOppFormTerm(clause1, clause2);
    console.log("opp form term: " + term);
    var knownTerms = new Set([...clause1.knownTerms, ...clause2.knownTerms]);
    knownTerms.delete(term);
    knownTerms.delete(negateTerm(term));
    return {
        id: crypto.randomUUID(), 
        name: "" + clause1.name + clause2.name,
        length: knownTerms.size,
        knownTerms: Array.from(knownTerms)
    };
}

// Get the positive version of the opposite form term; empty string if DNE
export function getOppFormTerm(clause1: Clause, clause2: Clause) {
    if (!validProcess(clause1, clause2)) {
        throw Error('Clauses cannot be combined');
    }
    var oppFormTerm = '';
    clause1.knownTerms.forEach((term1) => {
        if (clause2.knownTerms.includes(negateTerm(term1))) {
            if (term1[0] === '-') {
                oppFormTerm = negateTerm(term1);
            } else {
                oppFormTerm = term1;
            }
        } else {
            console.log('clause2 does not include ' + negateTerm(term1));
        }
    });
    return oppFormTerm;
}

// Remove duplicate clauses based on knownTerms
export function uniqueClauses(clauses: Clause[]) {
    var termSet: Set<string> = new Set();
    var clauseList: Clause[] = [];
    clauses.forEach((clause) => {
        const knownSetString = JSON.stringify(clause.knownTerms.sort());
        if (!termSet.has(knownSetString)) {
            termSet.add(knownSetString);
            clauseList.push(clause);
        }
    })
    return clauseList;
}

// render lines between families of clauses
export function RenderLines({families}: {families: {parent1: Clause, parent2: Clause, child: Clause}[]}) {
    var familyRects: { parent1: DOMRect | undefined; parent2: DOMRect | undefined; child: DOMRect | undefined; }[] = []
    families.map((family, i) => {
        familyRects.push({
            parent1: document.getElementById(family.parent1.id)?.getBoundingClientRect(),
            parent2: document.getElementById(family.parent2.id)?.getBoundingClientRect(),
            child: document.getElementById(family.child.id)?.getBoundingClientRect()
        })
    })
    return (
        <div>
            <svg className="fixed top-0 left-0 inset-0 w-full h-full pointer-events-none">
                {familyRects.map((family, i) => <>
                <LineHelper 
                    familyRects={family}
                />
                </>)}
                {/* {families.map((family, i) => <>
                <line
                    key={family.parent1.id + "" + i}
                    x1={document.getElementById(family.parent1.id)?.getBoundingClientRect().x}
                    y1={document.getElementById(family.parent1.id)?.getBoundingClientRect().top}
                    x2={document.getElementById(family.child.id)?.getBoundingClientRect().left}
                    y2={document.getElementById(family.child.id)?.getBoundingClientRect().top}
                    className="stroke-2 stroke-emerald-800"
                />
                <line
                    key={family.parent1.id + "" + i}
                    x1={document.getElementById(family.parent2.id)?.getBoundingClientRect().left}
                    y1={document.getElementById(family.parent2.id)?.getBoundingClientRect().top}
                    x2={document.getElementById(family.child.id)?.getBoundingClientRect().left}
                    y2={document.getElementById(family.child.id)?.getBoundingClientRect().top}
                    className="stroke-2 stroke-emerald-800"
                />
                </>
                )} */}
            </svg>
        </div>
    );
}

export function LineHelper({familyRects}: {familyRects: { parent1: DOMRect | undefined; parent2: DOMRect | undefined; child: DOMRect | undefined; }}){
    if (familyRects.parent1 === undefined || familyRects.parent2 === undefined || familyRects.child === undefined) {
        return (<></>);
    }
    const buffer = 5;
    const parent1ymed = (familyRects.parent1.top + familyRects.parent1.bottom)/2;
    const parent2ymed = (familyRects.parent2.top + familyRects.parent2.bottom)/2;
    const childymed = (familyRects.child!.top + familyRects.child!.bottom)/2;
    const xmed = familyRects.parent1.right > familyRects.parent2.right ? (familyRects.parent1.right + familyRects.child!.left)/2 : (familyRects.parent2.right + familyRects.child!.left)/2;
    const styling="stroke-2 stroke-black";
    return (
        <>
            {/* Right of parent1*/}
            <line 
                x1={familyRects.parent1.right}
                y1={parent1ymed}
                x2={xmed}
                y2={parent1ymed}
                className={styling}
            />
            {/* Right of parent2*/}
            <line 
                x1={familyRects.parent2.right}
                y1={parent2ymed}
                x2={xmed}
                y2={parent2ymed}
                className={styling}
            />
            {/* Left of child*/}
            <line 
                x1={familyRects.child!.left}
                y1={childymed}
                x2={xmed}
                y2={childymed}
                className={styling}
            />
            {/* Vertical at xmed*/}
            <line 
                x1={xmed}
                x2={xmed}
                y1={Math.max(parent1ymed, childymed, parent2ymed)}
                y2={Math.min(parent1ymed, childymed, parent2ymed)}
                className={styling}
            />
        </>
    );
}

export function RenderClause(){
    
    return (<>
        
    </>);
}

export interface Clause {
    id: string,
    name: string,
    length: number,
    knownTerms: string[]
}