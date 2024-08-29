export class Clause {
    id: string;
    name: string;
    length: number;
    col: number;
    known: Set<TermSet>;
    unknown: Set<TermSet>;
    excluded: Set<TermSet>;

    constructor(name: string, length: number, col: number, unknown?: Set<TermSet>, known?: Set<TermSet>, excluded?: Set<TermSet>, id?: string) {
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.name = name;
        this.length = length;
        this.col = col === undefined ? 2 : col;
        this.known = known === undefined ? new Set<TermSet>() : known;
        this.unknown = unknown === undefined ? new Set<TermSet>() : unknown;
        this.excluded = excluded === undefined ? new Set<TermSet>() : excluded;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            length: this.length,
            col: this.col,
            known: Array.from(this.known).toSorted((a, b) => a.id.localeCompare(b.id)),
            unknown: Array.from(this.unknown).toSorted((a, b) => a.id.localeCompare(b.id)),
            excluded: Array.from(this.excluded).toSorted((a, b) => a.id.localeCompare(b.id))
        }
    }

    // Takes in json object representing a clause and updates instance in place
    static from(json: any, instance: Instance) {
        const c = instance.getClauses(json.id);
        if (c) { return c[0] };
        const clause = new Clause(json.name, json.length, json.col, undefined, undefined, undefined, json.id);
        instance.clauses.push(clause);
        clause.unknown = TermSet.fromList(json.unknown, instance);
        clause.known = TermSet.fromList(json.known, instance);
        clause.excluded = TermSet.fromList(json.excluded, instance);
        return clause;
    }

    // Updates instance in place so it can reference the correct term objects
    static fromList(json: any, instance: Instance) {
        json.forEach((clause: any) => {
            Clause.from(clause, instance);
        })
    }

    // makes an exact copy of the clause (with new termset objects)
    copy() {
        var knownCopy = new Set<TermSet>();
        var unknownCopy = new Set<TermSet>();
        var excludedCopy = new Set<TermSet>();
        this.known.forEach((term) => {
            knownCopy.add(term.copy());
        })
        this.unknown.forEach((term) => {
            unknownCopy.add(term.copy());
        })
        this.excluded.forEach((term) => {
            excludedCopy.add(term.copy());
        })
        return new Clause(this.name, this.length, this.col, unknownCopy, knownCopy, excludedCopy, this.id);
    }

    // Get term with matching id or name
    getTerm(id?: string, name?: string) {
        var match: TermSet[] = [];
        if (id !== undefined) {
            match = Array.from(this.getAllTerms()).filter((term) => term.id === id);
        }
        if (match.length) {
            return match[0];
        }
        if (name !== undefined) {
            match = Array.from(this.getAllTerms()).filter((term) => term.name === name);
        }
        if (match.length) {
            return match[0];
        }
        return undefined;
    }

    // Get all terms in this clause, including excluded??
    getAllTerms() {
        var terms = this.known.union(this.unknown);
        terms = terms.union(this.excluded);
        this.unknown.forEach((unknown) => {
            terms = terms.union(unknown.known);
        })
        return terms;
    }

    // Get all terms' names
    getTermNames() {
        var names = new Set<string>();
        this.getAllTerms().forEach((term) => {
            names.add(term.name);
        })
        return names;
    }

    update(clause: Clause, instance?: Instance) {
        this.id = clause.id;
        this.name = clause.name;
        this.length = clause.length;
        this.col = clause.col;
        if (instance === undefined) {
            this.known = clause.known;
            this.unknown = clause.unknown;
            this.excluded = clause.excluded;
        } else {
            clause.known.forEach((t) => {
                this.known.add(instance.getTerm(t.id)!);        
            })
            clause.unknown.forEach((t) => {
                this.unknown.add(instance.getTerm(t.id)!);
            })
            clause.excluded.forEach((t) => {
                this.excluded.add(instance.getTerm(t.id)!);
            })
        }
    }

    inUnknown(term: TermSet) {
        var contains = false;
        this.unknown.forEach((unknown) => {
            if (unknown.known.has(term)) {
                contains = true;
            }
        })
        return contains;
    }

    // Returns placed terms (not counting excluded)
    getPlaced() {
        var terms = new Set<TermSet>();
        this.unknown.forEach((unk) => {
            terms = terms.union(unk.known).difference(this.excluded);
        })
        return terms;
    }

    // BIG ASSUMPTION - If an unknown termset does not explicitly contain a known term, we assume the term is not in that termset
    isSubsetOf(other: Clause) {
        var isSubset = true;
        this.unknown.forEach((unk) => {
            if (!other.unknown.has(unk)) {
                isSubset = false;
            }
        })
        this.getPlaced().forEach((term) => {
            if (other.excluded.has(term)) {
                isSubset = false;
            }
        })
        // console.log('testing if ' + this.name + ' is subset of ' + other.name + ' ' + isSubset);
        return isSubset;
    }

    equals(clause: Clause) {
        var dupe = true;
        this.excluded.forEach((exc) => {
            if (!clause.excluded.has(exc)) {
                dupe = false;
            }
        })
        // assuming no floating terms, no need to check known
        // this.known.forEach((known) => {
        //     if (!clause.known.has(known)) {
        //         dupe = false;
        //     }
        // })
        this.unknown.forEach((unknown) => {
            if (!clause.unknown.has(unknown)) {
                dupe = false;
            }
        })
        if (this.unknown.size !== clause.unknown.size || this.excluded.size !== clause.excluded.size) {
            dupe = false;
        }
        return dupe;
    }

}

export class TermSet {
    name: string;
    id: string;
    length: number;
    known: Set<TermSet>;

    constructor(name: string, length: number, known?: Set<TermSet>, id?: string) {
        this.name = name;
        this.length = length;
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.known = known === undefined ? new Set<TermSet>() : known;
    }

    getOppositeName() {
        if (this.name[0] === '-') {
            return this.name.substring(1);
        }
        return '-' + this.name;
    }

    getSpace() {
        var space = this.length;
        this.known.forEach((known) => {
            space -= known.length;
        })
        return space;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            length: this.length,
            known: Array.from(this.known).toSorted()
        }
    }

    static from(json: any, instance: Instance) {
        const t = instance.getTerm(json.id);
        if (t) { return t };
        return new TermSet(
            json.name,
            json.length,
            TermSet.fromList(json.known, instance),
            json.id
        )
    }

    static fromList(json: any, instance: Instance) {
        var terms = new Set<TermSet>();
        json.forEach((term: any) => {
            terms.add(TermSet.from(term, instance));
        })
        return terms;
    }

    // Returns exact copy of termset as well as copies of this.known
    copy() {
        var knownCopy = new Set<TermSet>();
        this.known.forEach((term) => {
            knownCopy.add(term.copy());
        })
        return new TermSet(this.name, this.length, knownCopy, this.id);
    }

    update(instance: Instance) {
        const t = instance.getTerm(this.id);
        this.known.forEach((term) => {
            t?.known.add(instance.getTerm(term.id)!);
            instance.getClauses(undefined, undefined, t)?.forEach((clause) => {
                clause.known.add(instance.getTerm(term.id)!);
            })

        })
    }

}

export enum ConnectionType {
    implication,
    expansion
}

export interface Connection {
    type: ConnectionType
    id: string
    output: Clause
    getInputs: () => Clause[]
    getClauses: () => Clause[]
}

export class Instance {
    clauses: Clause[];
    connections: Connection[];
    messages: string[]; // notes to the user about processing

    constructor(clauses: Clause[], connections: Connection[], messages?: string[]) {
        this.clauses = clauses;
        this.connections = connections;
        this.messages = messages === undefined ? [] : messages;
    }

    // TODO get better names
    addKnown(clause: Clause): TermSet {
        const used = this.getTermNames().union(clause.getTermNames());
        var names = 'abcdefghijklmnopqrstuvwxyz';
        var i = 0;
        while (i < names.length && used.has(names[i])) { i++ };
        var term;
        if (i === names.length) {
            term = new TermSet('a', 1);
            this.messages.push('[WARNING] There are too many terms and we\'re using the same name for many terms. Sorry.');
        } else {
            term = new TermSet(names[i], 1)
        }
        clause.known.add(term);
        return term;
    }

    addUnknown(clause: Clause) {
        const used = this.getTermNames().union(clause.getTermNames());
        const names = ['α', 'β', 'δ', 'ζ', 'η', 'λ', 'μ', 'π'];
        var i = 0;
        while (i < names.length && used.has(names[i])) { i++ };
        if (i === names.length) {
            clause.unknown.add(new TermSet('AA', 1));
        } else {
            clause.unknown.add(new TermSet(names[i], 1));
        }
    }

    addClause(length?: number, col?: number) {
        const used = this.getClauseNames();
        const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var i = 0;
        var name;
        while (i < names.length && used.has(names[i])) { i++ };
        var c: Clause;
        if (i === names.length) {
            name = 'A'
        } else {
            name = names[i]
        }
        c = new Clause(name, 3, 2);
        if (length !== undefined) {
            c.length = length
        }
        if (col !== undefined) {
            c.col = col
        }
        this.clauses.push(c);
        return c;
    }

    getClauses(id?: string, known?: TermSet, unknown?: TermSet) {
        if (id) {
            const clauseList = this.clauses.filter((clause) => clause.id === id);
            return clauseList.length === 0 ? undefined : clauseList;
        }
        if (known) {
            const clauseList = this.clauses.filter((clause) => clause.known.has(known));
            return clauseList.length === 0 ? undefined : clauseList;
        }
        if (unknown) {
            const clauseList = this.clauses.filter((clause) => clause.unknown.has(unknown));
            return clauseList.length === 0 ? undefined : clauseList;
        }
    }

    getConnection(id: string) {
        const conList = this.connections.filter((connection) => connection.id === id);
        return conList.length === 0 ? undefined : conList[0];
    }

    getTerm(id?: string, name?: string) {
        var match: TermSet[] = [];
        if (id !== undefined) {
            match = Array.from(this.getAllTerms()).filter((term) => term.id === id);
        }
        if (match.length) {
            return match[0];
        }
        if (name !== undefined) {
            match = Array.from(this.getAllTerms()).filter((term) => term.name === name);
        }
        if (match.length) {
            return match[0];
        }
        return undefined;
    }

    getTermNames() {
        var terms = new Set<string>();
        this.clauses.forEach((clause) => {
            terms = terms.union(clause.getTermNames());
        })
        return terms;
    }

    getClauseNames() {
        var names = new Set<string>();
        this.clauses.forEach((clause) => {
            names = names.add(clause.name);
        })
        return names;
    }

    getAllTerms() {
        var terms = new Set<TermSet>();
        this.clauses.forEach((clause) => {
            terms = terms.union(clause.getAllTerms());
        })
        return terms;
    }

    addOpposites() {
        this.getImplications().forEach((im) => {
            if (Array.from(im.positive.known).filter((t) => im.negative.getTerm(undefined, '-' + t.name)).length) { return; }
            const term = this.addKnown(im.positive);
            const negativeTerm = new TermSet('-' + term.name, 1);
            im.negative.known.add(negativeTerm);
            im.output.excluded = im.output.excluded.union(new Set([term, negativeTerm]));
            im.processed = true;

            this.updateUnknown(im);
            im.output.excluded = im.output.excluded.union(im.positive.excluded).union(im.negative.excluded);


        })
    }

    // Transfer the unknowns from an implication's inputs to its output
    // WARNING: if two implications have the same output, this will overwrite the unknowns
    updateUnknown(implication: Implication) {
        implication.output.unknown = implication.positive.unknown.union(implication.negative.unknown);
    }

    getExpansions() {
        return new Set(this.connections.filter((e) => e.type === ConnectionType.expansion) as Expansion[]);
    }

    getImplications() {
        return new Set(this.connections.filter((e) => e.type === ConnectionType.implication) as Implication[]);
    }

    toJSON() {
        return {
            clauses: this.clauses.toSorted(),
            connections: this.connections.toSorted(),
            messages: this.messages
        }
    }

    static from(json: any) {
        var instance = new Instance([], []);
        Clause.fromList(json.clauses, instance);
        json.messages.forEach((message: string) => {
            instance.messages.push(message);
        })
        json.connections.forEach((connection: Connection) => {
            // 0 is implication, 1 is expansion
            if (connection.type === 0) {
                instance.connections.push(Implication.from(connection, instance));
            }
            if (connection.type === 1) {
                instance.connections.push(Expansion.from(connection, instance));
            }
        })
        return instance;
    }

    copy() {
        const json = this.toJSON();
        return Instance.from(json);
    }

    getFloatingTerms() {
        const known = this.getKnownTerms();
        const placed = this.getPlacedTerms();

        const floatingTerms = Array.from(known).filter((k) => {
            return !placed.has(k);
        })

        return floatingTerms;
    }

    getKnownTerms() {
        var terms = new Set<TermSet>();
        this.clauses.forEach((clause) => {
            terms = terms.union(clause.known);
        })
        return terms;
    }

    getPlacedTerms() {
        var terms = new Set<TermSet>();
        this.clauses.forEach((clause) => {
            clause.unknown.forEach((unk) => {
                terms = terms.union(unk.known);
            })
        })
        return terms;
    }

    process() {
        this.addOpposites();

        const clauses = this.findClausesforPlacement();

        const possibleClauses: Clause[][] = [];

        clauses.forEach((clause) => {
            const terms = this.getTermstoPlace(clause);
            const base = this.getBase(clause);
            const placements = this.helper(clause, terms).filter(c => c.getTerm(base.id)?.known.size);
            possibleClauses.push(placements);
            console.log('placements for ' + clause.name);
            console.log(JSON.stringify(placements));
        })

        const orderedClauses = this.getOrderedClauses(possibleClauses);
        console.log(JSON.stringify(orderedClauses));

        const instances: Instance[] = [];

        orderedClauses.forEach((group) => {
            const instance = this.copy();
            group.forEach((clause) => {
                clause.getAllTerms().forEach((term) => {
                    term.update(instance);
                });
            })
            instances.push(instance);
        })

        return instances;
    }

    getOrderedClauses(clauses: Clause[][]) {
        if (clauses.length == 1) {
            const ans: Clause[][] = [];
            clauses[0].forEach((c) => ans.push([c]));
            return ans;
        }
        var ans: Clause[][] = [];
        const rest = this.getOrderedClauses(clauses.slice(1));
        clauses[0].forEach((clause) => {
            rest?.forEach((c) => {
                ans.push([clause, ...c]);
            })
        })
        return ans;
    }

    // Return list of clauses for each possible term placement, guarantees base has at least one
    helper(clause: Clause, terms: TermSet[]) {
        if (terms.length == 0) {
            return [clause];
        }
        var ans: Clause[] = [];
        Array.from(clause.unknown).filter(x => x.getSpace() > 0).forEach((unk) => {
            const c = clause.copy();
            c.getTerm(unk.id)?.known.add(terms[0]);
            const rest = this.helper(c, terms.filter(x => x != terms[0]));
            ans = [...ans, ...rest];
        })
        return ans;
    }

    // Return a copy of instance placing term in unknown
    placeTerm(term: TermSet, unknown: TermSet) {
        const instance = this.copy();
        const localterm = instance.getTerm(term.id);
        const localunk = instance.getTerm(unknown.id);
        if (localunk!.getSpace() > 0) {
            localunk!.known.add(localterm!);
        }
        return instance;
    }

    // Get the termset in the the most ancestral ancestor of clause
    // Should simply be the longest unknown
    getBase(clause: Clause) {
        var longest: TermSet | undefined = undefined;
        clause.unknown.forEach((unk) => {
            if (longest === undefined || unk.length > longest.length) {
                longest = unk;
            }
        })
        return longest!;
    }

    placeTerms(clause: Clause, terms: TermSet[]) {
        const instances: Instance[] = [];
        Array.from(clause.unknown).filter((t) => t.getSpace() > 0).forEach((unk) => {
            terms.forEach((term) => {
                const instance = this.copy();
                const localUnkown = instance.getTerm(unk.id);
                const localKnown = instance.getTerm(term.id);
                localUnkown?.known.add(localKnown!);
            })
        })

    }

    // Iterate through clauses children, adding all known term sets
    // TODO optimize
    getTermstoPlace(clause: Clause) {
        var terms: TermSet[] = [];
        var c = clause;
        var valid = true;
        while (valid) {
            valid = false;
            terms = terms.concat(Array.from(c.known).filter((t) => !c.excluded.has(t)));
            this.connections.forEach((con) => {
                if (!valid && con.getInputs().includes(c)) {
                    c = con.output;
                    valid = true;
                }
            })
        }
        return terms;
    }

    // Return the list of clauses that are the final clauses before a series of reductions to the target
    // TODO optimize - tis very very slow as of now
    findClausesforPlacement() {
        const ans: Clause[] = []
        this.clauses.forEach((clause) => {
            var valid = true;
            this.connections.forEach((con) => {
                if (con.type == ConnectionType.expansion && con.getInputs()[0] == clause) {
                    valid = false
                }
                else if (con.type == ConnectionType.implication && con.output == clause) {
                    valid = false
                }
            })
            if (valid) {
                ans.push(clause)
            }
        })
        return ans;
    }

    // Prepend a message to this instance with the longest required term based on the inputs
    // Allows for no floating terms
    getLongestRequiredClause(target: Clause) {
        if (this.getFloatingTerms().length > 0) {
            this.messages.push('[ERROR] Floating Terms are not allowed when calculating the longest required term. Please place the following terms: ');
            this.getFloatingTerms().forEach((t) => {
                this.messages.push(t.name);
            })
            return;
        }

        var current = this.getLongestClause();
        var maybes: { clause: Clause, message: string }[] = [];

        this.clauses.forEach((clause) => {
            // console.log('longest ancestor of ' + clause.name + ' is ' + this.getLongestAncestor(clause).length);
            if (this.getLongestAncestor(clause).length < current.length) {
                if (clause.isSubsetOf(target)) {
                    // console.log(clause.name + ' can expand to ' + target.name);
                    maybes.push({ clause: clause, message: 'Clause ' + clause.name + ' can expand to clause ' + target.name });
                    current = this.getLongestAncestor(clause);
                }
            }
        })
        this.messages.unshift();
        this.messages[0] = current.length + ' is the longest clause required to derive ' + target.name;
        maybes.forEach((maybe) => {
            if (maybe.clause === current) {
                this.messages.push(maybe.message);
            }
        })

    }

    equals(instance: Instance) {
        const thisjson = this.toJSON();
        const other = instance.toJSON();
        return JSON.stringify(thisjson) === JSON.stringify(other);
    }

    getLongestClause() {
        var longest = 0;
        var c = this.clauses[0];
        this.clauses.forEach((clause) => {
            if (clause.length > longest) {
                c = clause;
                longest = clause.length;
            }
        })
        return c;
    }

    // Traces the implication graph to get the longest required ancestor (including self)
    getLongestAncestor(clause: Clause) {
        var minRequired: Clause | undefined = undefined;

        this.connections.filter((con) => con.output === clause).forEach((con) => {
            var c = clause;
            con.getInputs().forEach((input) => {
                const inputAncestor = this.getLongestAncestor(input);
                if (inputAncestor !== undefined && inputAncestor.length > c.length) {
                    c = inputAncestor
                }
            })
            if (minRequired === undefined || (c.length > 0 && c.length < minRequired.length)) {
                minRequired = c;
            }
        })

        return minRequired === undefined ? clause : minRequired;
    }

    // Based on placed terms, add new clauses and implications that exist because of them
    addNewImplications() {
        if (this.getFloatingTerms().length > 0) {
            this.messages.push('[ERROR] Floating Terms are not allowed when calculating the longest required term. Please place the following terms: ');
            this.getFloatingTerms().forEach((t) => {
                this.messages.push(t.name);
            })
            return;
        }

        // Warning: changing clauses while iterating
        this.clauses.forEach((clause) => {
            Array.from(clause.known).filter(known => known.name[0] !== "-" && !clause.excluded.has(known)).forEach((pterm) => {
                const nterm = this.getTerm(undefined, pterm.getOppositeName());
                const oppClauses = this.getClauses(undefined, nterm);
                if (oppClauses && nterm) {
                    oppClauses.filter((c) => !c.excluded.has(nterm)).forEach((other) => {

                        var output = this.addClause();
                        output.unknown = clause.unknown.union(other.unknown);
                        output.known = clause.known.union(other.known);
                        output.col = clause.col + 1;
                        output.excluded = new Set([pterm, nterm]);
                        this.setLength(output);
                        const dupe = this.duplicateClause(output);
                        if (dupe) {
                            this.clauses = this.clauses.filter((c) => c.id !== output.id);
                            output = dupe;
                        } else {
                            this.messages.push('Adding clause ' + output.name);
                        }
                        const implication = new Implication(clause, other, output, undefined, true);
                        if (!this.duplicateImplication(implication)) {
                            this.messages.push('Adding implication from ' + clause.name + ' and ' + other.name + ' to ' + output.name);
                            this.connections.push(implication);
                            this.updateUnknown(implication);
                        }
                    })
                }
            })
        })

    }

    // Considering the length of other clauses, set the largest possible length for clause
    setLength(clause: Clause) {
        var max = -1;
        this.clauses.filter(c => c.length > 0).forEach((c) => {
            if (clause.isSubsetOf(c)) {
                max = Math.max(max, c.length);
            }
        })
        clause.length = max;
    }

    // return true if clause with same known, unknown, and excluded exists in this.clauses
    duplicateClause(clause: Clause) {
        var dupe = undefined;
        this.clauses.filter(c => c.id !== clause.id).forEach((other) => {
            if (other.equals(clause)) {
                dupe = other;
            }
        })
        return dupe;
    }

    duplicateImplication(implication: Implication) {
        var dupe = undefined;
        (this.connections.filter((c) => c.type === ConnectionType.implication) as Implication[]).forEach((other) => {
            if (other.equals(implication)) {
                dupe = other;
            }
        })
        return dupe;
    }

}

export class Implication implements Connection {
    type: ConnectionType = ConnectionType.implication;
    id: string;
    positive: Clause;
    negative: Clause;
    output: Clause;
    processed: boolean;

    constructor(positive: Clause, negative: Clause, output: Clause, id?: string, processed?: boolean) {
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.positive = positive;
        this.negative = negative;
        this.output = output;
        this.processed = processed === undefined ? false : processed;
    }

    public getClauses() {
        return [this.positive, this.negative, this.output];
    }

    public getInputs() {
        return [this.positive, this.negative]
    }

    // copy(instance?: Instance) {
    //     if (instance === undefined) {
    //         return new Implication(this.positive.copy(), this.negative.copy(), this.output.copy(), this.id, this.processed);
    //     } else {
    //         return new Implication(
    //             instance.getClause(this.positive.id)!,
    //             instance.getClause(this.negative.id)!,
    //             instance.getClause(this.output.id)!,
    //             this.id,
    //             this.processed
    //         );
    //     }
    // }

    static from(json: any, instance: Instance) {
        const c = instance.getConnection(json.id);
        if (c) { return c };
        return new Implication(
            Clause.from(json.positive, instance),
            Clause.from(json.negative, instance),
            Clause.from(json.output, instance),
            json.id,
            json.processed
        )
    }

    equals(implication: Implication) {
        return this.positive === implication.positive && this.negative === implication.negative && this.output === implication.output;
    }
}

export class Expansion implements Connection {
    type: ConnectionType = ConnectionType.expansion;
    id: string;
    input: Clause;
    output: Clause

    public constructor(input: Clause, output: Clause, id?: string) {
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.input = input;
        this.output = output;
    }

    public getClauses() {
        return [this.input, this.output];
    }

    public getInputs() {
        return [this.input];
    }

    static from(json: any, instance: Instance) {
        const c = instance.getConnection(json.id);
        if (c) { return c };
        return new Expansion(
            Clause.from(json.input, instance),
            Clause.from(json.output, instance),
            json.id
        )
    }
}