import { randomUUID } from "crypto"
import { Expansion, Implication } from "./Connections"
import { TermSet, Term } from "./Terminal"
import { ClauseData } from "@/app/types/graph"

export class Clause {
    id: string
    name: string
    length: number
    
    private termSets: Array<TermSet>
    
    known: Array<Term>
    placed: Array<Term>
    excluded: Array<Term>

    intoExpansions: Array<Expansion>
    fromExpansions: Array<Expansion>
    intoImplications: Array<Implication>
    fromImplications: Array<Implication>
    
    constructor(name: string, length: number) {
        this.id = randomUUID()
        this.name = name.toUpperCase()
        this.length = length
        
        this.termSets = Array()
        this.known = Array()
        this.placed = Array()
        this.excluded = Array()

        this.intoExpansions = Array()
        this.fromExpansions = Array()
        this.intoImplications = Array()
        this.fromImplications = Array()
    }

    /**
     * Add 1 or more termSets to the clause. Also updates termSet.clauses
     * @param termSets 
     */
    addTermSet(...termSets: TermSet[]) {
        for (let termSet of termSets) {
            termSet.clauses.push(this)
        }

        this.termSets.push(...termSets)
    }

    getTermSets() {
        return this.termSets
    }


    /**
     * Get the OFT in this clause whose opposite form is in other
     * @param other 
     * @returns this clause's OFT if found, null otherwise
     */
    getOFT(other: Clause) : Term | null {
        let positiveOFT: Term | null = null
        for (let term of this.known) {
            const negative = term.getOFT()
            if (other.known.includes(negative)) {
                if (positiveOFT) {
                    return null
                }
                positiveOFT = term
            }
        }
        return positiveOFT
    }

    /**
     * Returns the other input clause of the implications
     * @param implication 
     * @returns 
     */
    getOtherInput(implication: Implication) : Clause {
        const inputs = implication.input
        return inputs[0] === this ? inputs[1] : inputs[0]
    }

    /**
     * Returns whether an implication with input `this` and `other` exists
     * @param other 
     */
    implicationExists(other: Clause) {
        for (let implication of this.intoImplications) {
            if (this.getOtherInput(implication) === other) {
                return true
            }
        }
        return false
    }

    /**
     * Returns whether an expansion from `this` to `other` exists
     * @param other 
     * @returns 
     */
    expansionExists(other: Clause) {
        for (let expansion of this.intoExpansions) {
            if (expansion.output === other) {
                return true
            }
        }
        return false
    }

    /**
     * Return whether `this` is a subset of `other`
     * 
     * Conditions: 
     * 
     * 1. All termSets in `this` exist in `other`
     * 2. All excluded terms in `other` are excluded from `this`
     * @param other 
     */
    isSubsetOf(other: Clause) {
        for (let termSet of this.termSets) {
            if (!other.termSets.includes(termSet)) {
                return false
            }
        }

        for (let term of other.excluded) {
            if (!this.excluded.includes(term)) {
                return false
            }
        }

        return true
    }

    /**
     * Resets all termSets and terms
     */
    resetPlacements() {
        this.termSets = new Array()
        this.known = new Array()
        this.placed = new Array()
        this.excluded = new Array()
    }

    /**
     * Returns the ClauseData object
     * @returns 
     */
    getData(): ClauseData {
        return {
            id: this.id,
            name: this.name,
            length: this.length,
            termSets: this.termSets.map((t) => t.getData()),
            known: this.known.map((t) => t.getData()),
            placed: this.placed.map((t) => t.getData()),
            excluded: this.excluded.map((t) => t.getData())
        }
    }
}