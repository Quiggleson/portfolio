import { randomUUID } from "crypto"
import { Clause } from "./Clause"
import { TermData, TerminalData, TermSetData } from "@/app/types/graph"

enum TermType {
    positive,
    negative
}

export class Term {
    name: string
    terminal: Terminal
    termType: TermType

    inKnown: Array<Clause>
    inPlaced: Array<Clause>
    inExcluded: Array<Clause>
    inTermSet: Array<TermSet>

    constructor(name: string, terminal: Terminal, termType: TermType) {
        this.name = name
        this.terminal = terminal
        this.termType = termType

        this.inKnown = Array()
        this.inPlaced = Array()
        this.inExcluded = Array()
        this.inTermSet = Array()
    }
    
    /**
     * Get the list of termSets this term can be placed in.
     * If this term is in a clauses known list of terms, this term may
     * be placed in any of that clause's termSets
     * @returns {TermSet[]}
     */
    getPotentialTermSets() {
        if (this.inTermSet.length > 0) return []
        
        const termSets = []
        
        for (let clause of this.inKnown) {
            termSets.push(...clause.getTermSets())
        }
        
        return Array.from(new Set(termSets))
    }

    /**
     * Get the opposite form term of this term
     * @returns Term
     */
    getOFT() {
        if (this === this.terminal.positive) {
            return this.terminal.negative
        }
        return this.terminal.positive
    }
    
    /**
     * Get the TermData of this object
     * @returns TermData
     */
    getData(): TermData{
        return {
            name: this.name,
            inTermSets: this.inTermSet.map((ts) => ts.getData())
        }
    }

}

export class Terminal {
    name: string
    positive: Term
    negative: Term

    constructor(name: string) {
        this.name = name
        this.positive = new Term(`+${name}`, this, TermType.positive)
        this.negative = new Term(`-${name}`, this, TermType.negative)
    }

    /**
     * Get the TerminalData of this object
     * @returns TerminalData
     */
    getData(): TerminalData{
        return {
            name: this.name,
            positive: this.positive.name,
            negative: this.negative.name
        }
    }
}

export class TermSet {
    id: string
    name: string
    length: number
    
    private terms: Array<Term>
    clauses: Array<Clause>

    constructor(name: string, length: number) {
        this.id = randomUUID()
        this.name = name + "_" + length
        this.length = length
        this.terms = new Array()
        this.clauses = new Array()
    }

    /**
     * Add term to termSet, 
     * 
     * Add this to term.inTermSet,
     * 
     * Add each clause to term.inPlaced
     * 
     * and update all clauses.placed that contain this termSet
     * @param term 
     */
    addTerm(term: Term) {
        this.terms.push(term)
        term.inTermSet.push(this)

        for(let clause of this.clauses) {
            if (clause.excluded.includes(term)) continue
            
            term.inPlaced.push(clause)
            term.inKnown.push(clause)

            clause.placed.push(term)
            if (!clause.known.includes(term)) {
                clause.known.push(term)
            }
        }
    }

    getTerms() {
        return this.terms
    }

    /**
     * Returns the TermSetData of this object
     * @returns TermSetData
     */
    getData() : TermSetData {
        return {
            id: this.id,
            name: this.name,
            length: this.length
        }
    }
}