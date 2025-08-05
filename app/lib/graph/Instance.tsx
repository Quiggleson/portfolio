import { Clause } from "./Clause"
import { Expansion, Implication } from "./Connections"
import { Terminal, Term, TermSet } from "./Terminal"

export enum NameGen {
    Clause,
    TermSet,
    Terminal
}

export class Instance {

    nextClause: string
    nextTermSet: string
    nextTerminal: string

    clauses: Map<string, Clause>
    expansions: Map<string, Expansion>
    implications: Map<string, Implication>
    terminals: Array<Terminal>
    termSets: Map<string, TermSet>
    terms: Map<string, Term>

    constructor(length: number | undefined = undefined) {
        this.nextClause = "a"
        this.nextTermSet = "a"
        this.nextTerminal = "a"

        this.clauses = new Map()
        this.expansions = new Map()
        this.implications = new Map()
        this.terminals = new Array()
        this.termSets = new Map()
        this.terms = new Map()

        if (length) {
            for (var i = 0; i < length; i++) {
                this.addTerminal()
            }
        }
    }

    /**
     * given the type of object, return the next name for that object
     * @param {NameGen} item - an enum representing a Clause, TermSet, or Term
    */
    private getNextName(item: NameGen): string {

        var oldName

        if (item === NameGen.Clause) {
            oldName = this.nextClause
        }
        else if (item === NameGen.TermSet) {
            oldName = this.nextTermSet
        }
        else if (item === NameGen.Terminal) {
            oldName = this.nextTerminal
        }
        else {
            throw Error
        }

        const chars = oldName.split('')
        let i = chars.length - 1

        while (i >= 0) {
            if (chars[i] === 'z') {
                chars[i] = 'a'
                i--
            } else {
                chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1)
                return chars.join('')
            }
        }

        return 'a'.repeat(oldName.length + 1)
    }

    /**
     * Add a clause to the instance
     * @param length the length of the clause to add, defaults to 3
     */
    addClause(length: number = 3): Clause {
        const clause = new Clause(this.nextClause, length)
        this.clauses.set(clause.id, clause)
        this.nextClause = this.getNextName(NameGen.Clause)
        return clause
    }

    /**
     * Deletes clause and all neighboring expansions and implications
     * @param id 
     */
    deleteClause(id: string) {
        const clause = this.clauses.get(id)

        if (!clause) return

        this.clauses.delete(id)

        for (let expansion of [...clause.intoExpansions, ...clause.fromExpansions]) {
            this.deleteExpansion(expansion.id)
        }

        for (let implication of [...clause.intoImplications, ...clause.fromImplications]) {
            this.deleteImplication(implication.id)
        }

    }

    /**
     * Add a terminal to the instance
     * @returns the newly added terminal
     */
    addTerminal(): Terminal {
        const terminal = new Terminal(this.nextTerminal)
        this.terminals.push(terminal)
        this.terms.set(terminal.positive.name, terminal.positive)
        this.terms.set(terminal.negative.name, terminal.negative)
        this.nextTerminal = this.getNextName(NameGen.Terminal)
        return terminal
    }

    /**
     * Add a termSet to the instance
     * @param length length of the termSet
     * @returns the newly added termSet
     */
    addTermSet(length: number): TermSet {
        const termSet = new TermSet(this.nextTermSet, length)
        this.termSets.set(termSet.id, termSet)
        this.nextTermSet = this.getNextName(NameGen.TermSet)
        return termSet
    }

    /**
     * Adds a new expansion between two existing clauses to the instance
     * @param input the input clause
     * @param output the output clause
     * @returns the newly added expansion
     */
    addExpansion(input: Clause, output: Clause): Expansion {
        for (let clause of [input, output]) {
            if (!this.clauses.has(clause.id)) {
                throw new Error("Clause not found in instance")
            }
        }

        const expansion = new Expansion(input, output)
        this.expansions.set(expansion.id, expansion)

        input.intoExpansions.push(expansion)
        output.fromExpansions.push(expansion)

        return expansion
    }

    /**
     * Remove expansion
     * 
     * Note: this does not delete the neighboring clauses
     * @param id 
     */
    deleteExpansion(id: string) {
        this.expansions.delete(id)
    }

    /**
     * Add a new implication between existing clauses to the instance
     * @param input a list of two input clauses
     * @param output the output clause
     * @returns the newly created implication
     */
    addImplication(input: Array<Clause>, output: Clause): Implication {
        for (let clause of [...input, output]) {
            if (!this.clauses.has(clause.id)) {
                throw new Error("Clause not found in instance")
            }
        }

        const implication = new Implication(input, output)
        this.implications.set(implication.id, implication)

        input[0].intoImplications.push(implication)
        input[1].intoImplications.push(implication)
        output.fromImplications.push(implication)

        return implication
    }

    /**
     * Remove implication
     * 
     * Note: this does not delete the neighboring clauses
     * @param id 
     */
    deleteImplication(id: string) {
        this.implications.delete(id)
    }

    /**
     * Create and add a new implication to the instance
     * @param inputA 
     * @param inputB 
     */
    addNewImplication(inputA: Clause, inputB: Clause) {
        let termA = inputA.getOFT(inputB)

        if (!termA) { throw Error("Cannot add new implication, no OFT found") }

        let termB = termA?.getOFT()

        const output = this.addClause()

        output.addTermSet(...inputA.getTermSets())
        output.addTermSet(...inputB.getTermSets())
        output.known.push(...inputA.known.filter((t) => t !== termA))
        output.known.push(...inputB.known.filter((t) => t !== termB))
        output.placed.push(...inputA.placed.filter((t) => t !== termA))
        output.placed.push(...inputB.placed.filter((t) => t !== termB))
        output.excluded.push(...inputA.excluded)
        output.excluded.push(...inputB.excluded)
        output.excluded.push(...[termA, termB])

        this.addImplication([inputA, inputB], output)
    }

    /**
     * Checks various aspects of the instance for inconsistencies
     * 
     * For example, expansions and implications force the lengths of clauses
     * @returns list of inconsistencies within the instance
     */
    checkForm(): Array<string> {
        const errors: Array<string> = Array()

        // Check lengths of clauses in expansions
        for (let expansion of this.expansions.values()) {
            const input = expansion.input
            const output = expansion.output

            if (input.length + 1 !== output.length) {
                errors.push(
                    "clause '" + output.name +
                    "' should be one term longer than " +
                    " clause '" + input.name + "' from expansion\n"
                )
            }
        }

        // Check lengths of clauses in implications
        for (let implication of this.implications.values()) {
            const a = implication.input[0]
            const b = implication.input[1]
            const output = implication.output

            if (output.length < Math.max(a.length, b.length) - 1) {
                errors.push("clause '" + output.name + " is too short from implication\n")
            }
            if (output.length > a.length + b.length - 2) {
                errors.push("clause '" + output.name + " is too long from expansion\n")
            }
        }

        // Check no termSet is longer than its clause
        for (let clause of this.clauses.values()) {
            for (let termSet of clause.getTermSets()) {
                if (termSet.length > clause.length) {
                    errors.push(
                        "termSet '" + termSet.name +
                        "' is too long in clause '" +
                        clause.name + "'\n")
                }
            }
        }

        return errors
    }

    /**
     * Add termSets and terms forced by expansion or implication
     * 
     * Only to be used when no termSets are placed
     */
    addForcedPlacements() {
        for (let clause of this.clauses.values()) {
            if (clause.getTermSets().length) {
                throw Error("Call to addForcedPlacements expected clause '" +
                    clause + "' to be empty of termSets"
                )
            }
        }

        for (let clause of this.clauses.values()) {
            this.forceInClause(clause)
        }
    }

    /**
     * TODO: what if a clause is the output of more than one termSet?
     * 
     * Place the forced termSets in the given clause. 
     * 
     * TermSets are forced if the clause is an output of expansion or implication
     * 
     * Base case: if the clause is not the output of any connection, 
     * add a termSet with the same length as the clause
     * @param clause the given clause
     */
    private forceInClause(clause: Clause) {

        if (clause.getTermSets().length) {
            return
        }

        if (!clause.fromExpansions.length && !clause.fromImplications.length) {
            const termSet = this.addTermSet(clause.length)
            clause.addTermSet(termSet)
            return
        }

        for (let expansion of clause.fromExpansions) {
            this.addExpansionPlacements(expansion)
        }

        for (let implication of clause.fromImplications) {
            this.addImplicationPlacements(implication)
        }
    }

    /**
     * given an expansion, place the forced termSets
     * 
     * this function double checks the input clause and places 
     * those termSets before placing the output's termSets
     * @param expansion the given expansion
     */
    private addExpansionPlacements(expansion: Expansion) {
        const input = expansion.input
        const output = expansion.output

        if (input.getTermSets().length === 0) {
            this.forceInClause(input)
        }

        output.addTermSet(...input.getTermSets())

        const termSet = this.addTermSet(1)
        output.addTermSet(termSet)

    }

    /**
     * Given an implication, placed the forced termSets in the output.
     * This function double checks the inputs and places termSets there if empty
     * @param implication The given implication
     */
    private addImplicationPlacements(implication: Implication) {
        const inputA = implication.input[0]
        const inputB = implication.input[1]
        const output = implication.output

        if (inputA.getTermSets().length === 0) {
            this.forceInClause(inputA)
        }

        if (inputB.getTermSets().length === 0) {
            this.forceInClause(inputB)
        }

        output.addTermSet(...inputA.getTermSets())
        output.addTermSet(...inputB.getTermSets())

        const terminal = this.addTerminal()
        output.excluded.push(terminal.positive)
        output.excluded.push(terminal.negative)

        inputA.known.push(terminal.positive)
        inputB.known.push(terminal.negative)

        terminal.positive.inKnown.push(inputA)
        terminal.negative.inKnown.push(inputB)
    }

    /**
     * @returns the list of clauses with no ancestors
     */
    getOriginalClauses(): Array<Clause> {
        const clauses = Array.from(this.clauses.values()).filter((clause) => {
            return (!clause.fromExpansions.length &&
                !clause.fromImplications.length)
        })
        return clauses
    }

    /**
     * Scan the instance for clauses with opposite form terms
     * and make a new implication (and possibly clauses) with them
     * 
     */
    addForcedImplications() {
        for (let clause of this.clauses.values()) {
            for (let term of clause.known) {
                const oft = term.getOFT()
                for (let other of oft.inKnown) {
                    if (!clause.getOFT(other)) continue
                    if (clause.implicationExists(other)) continue

                    this.addNewImplication(clause, other)
                }
            }
        }
    }

    /**
     * Scan the instance for clauses, input and output, satisfying:
     * input.excluded === output.excluded
     * input.termSets is a proper subset of output.termSets
     * 
     */
    addForcedExpansions() {
        for (let clause of this.clauses.values()) {
            for (let other of this.clauses.values()) {
                if (clause === other) continue
                if (!clause.isSubsetOf(other)) continue
                if (clause.expansionExists(other)) continue

                const clauseTS = new Set(clause.getTermSets())
                const otherTS = new Set(other.getTermSets())
                const difTS = Array.from(otherTS.difference(clauseTS))

                // TODO - what if other has more termSets, but they're 
                // all N/A because they're in Excluded?
                // For now, assume termSets only exist in a clause
                // if they have at least one term not in excluded
                if (difTS.length > 1 || difTS[0].length > 1) continue

                this.addExpansion(clause, other)
            }
        }
    }

    /**
     * remove all terms and termSets from the instance
     */
    resetPlacements() {
        this.nextTermSet = "a"
        this.nextTerminal = "a"
        
        this.terminals = new Array()
        this.termSets = new Map()
        this.terms = new Map()

        for (let clause of this.clauses.values()) {
            clause.resetPlacements()
        }
    }

    /**
     * @returns InstanceData representing this object
     */
    getData() {
        return {
            clauses: Array.from(this.clauses.values()).map((c) => c.getData()),
            expansions: Array.from(this.expansions.values()).map((e) => e.getData()),
            implications: Array.from(this.implications.values()).map((i) => i.getData())
        }
    }

}