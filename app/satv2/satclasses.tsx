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
            known: Array.from(this.known),
            unknown: Array.from(this.unknown),
            excluded: Array.from(this.excluded)
        }
    }

    // Reads known and unknown as lists
    // WARNING, if the same term exists in known and unknown, it will get buggy
    static from(json: any, instance: Instance) {
        const c = instance.getClause(json.id);
        if (c) { return c };
        const clause = new Clause(json.name, json.length, json.col, undefined, undefined, undefined, json.id);
        instance.clauses.push(clause);
        clause.unknown = TermSet.fromList(json.unknown, instance);
        clause.known = TermSet.fromList(json.known, instance);
        clause.excluded = TermSet.fromList(json.excluded, instance);
        return clause;
    }

    static fromList(json: any, instance: Instance) {
        json.forEach((clause: any) => {
            Clause.from(clause, instance);
            // no longer have to push since updating instance in place
            // instance.clauses.push(Clause.from(clause, instance));
        })
    }

    // Should only be used when copying for new instance as it copies the id
    copy() {
        var knownCopy = new Set<TermSet>();
        var unknownCopy = new Set<TermSet>();
        var excludedCopy = new Set<TermSet>();
        this.known.forEach((term) => {
            knownCopy.add(term);
        })
        this.unknown.forEach((term) => {
            unknownCopy.add(term);
        })
        this.excluded.forEach((term) => {
            excludedCopy.add(term);
        })
        return new Clause(this.name, this.length, this.col, unknownCopy, knownCopy, excludedCopy, this.id);
    }

    addKnown(term: TermSet) {
        this.known.add(term);
    }

    addUnknown(term: TermSet) {
        this.known.add(term);
    }

    addExcluded(term: TermSet) {
        this.excluded.add(term);
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

    getAllTerms() {
        console.log(JSON.stringify(Array.from(this.unknown)));
        console.log(JSON.stringify(Array.from(this.known)));
        console.log(JSON.stringify(Array.from(this.excluded)));
        var terms = this.known.union(this.unknown);
        terms = terms.union(this.excluded);
        this.unknown.forEach((unknown) => {
            terms = terms.union(unknown.known);
        })
        return terms;
    }

    getTermNames() {
        var names = new Set<string>();
        this.getAllTerms().forEach((term) => {
            names.add(term.name);
        })
        return names;
    }

    update(clause: Clause) {
        this.id = clause.id;
        this.name = clause.name;
        this.length = clause.length;
        this.col = clause.col;
        this.known = clause.known;
        this.unknown = clause.unknown;
        this.excluded = clause.excluded;
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
            known: Array.from(this.known)
        }
    }

    static from(json: any, instance: Instance) {
        const t = instance.getTerm(json.id);
        if (t) { return t };
        // var known = new Set<TermSet>();
        // json.known.forEach((term: any) => {
        //     known.add(TermSet.from(term, instance));
        // })

        console.log('adding new term ' + json.name );
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

}

export enum ConnectionType {
    implication,
    expansion
}

export interface Connection {
    type: ConnectionType
    id: string
    getClauses: () => Clause[]
}

export class Instance {
    clauses: Clause[];
    connections: Connection[];

    constructor(clauses: Clause[], connections: Connection[]) {
        this.clauses = clauses;
        this.connections = connections;
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
            console.log('[WARNING] There are too many terms and we\'re using the same name for many terms. Sorry.')
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

    getClause(id: string) {
        const clauseList = this.clauses.filter((clause) => clause.id === id);
        return clauseList.length === 0 ? undefined : clauseList[0];
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

    addClause() {
        const used = this.getClauseNames();
        const names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var i = 0;
        while (i < names.length && used.has(names[i])) { i++ };
        var c: Clause;
        if (i === names.length) {
            c = new Clause('A', 3, 2);
        } else {
            c = new Clause(names[i], 3, 2);
        }
        this.clauses.push(c);
        return c;
    }

    addOpposites() {
        this.getImplications().forEach((im) => {
            if (Array.from(im.positive.known).filter((t) => im.negative.getTerm(undefined, '-' + t.name)).length) { return; }
            const term = this.addKnown(im.positive);
            im.negative.addKnown(new TermSet('-' + term.name, 1));
            im.processed = true;

        })
    }

    getExpansions() {
        return new Set(this.connections.filter((e) => e.type === ConnectionType.expansion) as Expansion[]);
    }

    getImplications() {
        return new Set(this.connections.filter((e) => e.type === ConnectionType.implication) as Implication[]);
    }

    toJSON() {
        return {
            clauses: this.clauses,
            connections: this.connections
        }
    }

    static from(json: any) {
        var instance = new Instance([], []);
        Clause.fromList(json.clauses, instance);
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
        return Instance.from(json); // lol
    }

    getFloatingTerms() {
        const known = this.getKnownTerms();
        const placed = this.getPlacedTerms();
        console.log('known: ' + JSON.stringify(Array.from(known)));
        console.log('placed: ' + JSON.stringify(Array.from(placed)));
        // console.log('checking instance ' + JSON.stringify(this));

        const floatingTerms = Array.from(known).filter((k) => {
            console.log('testing ' + k.name);
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

    // oh boy, this is the big one
    process() {
        var instances: Instance[] = [this];
        this.addOpposites();
        this.clauses.forEach((clause) => {
            Array.from(clause.known).filter((known) => !clause.inUnknown(known)).forEach((known) => {
                console.log(known.name + ' is in unknown? ' + JSON.stringify(Array.from(clause.unknown)));
                // console.log('inspecting known ' + known.name);
                Array.from(clause.unknown).filter((unk) => unk.getSpace() > 0).forEach((unk) => {
                    // console.log('inspecting unknown ' + unk.name);
                    const instance = this.copy();
                    const localUnk = instance.getTerm(unk.id);
                    const localKnown = instance.getTerm(known.id);
                    if (localUnk && localKnown) {
                        console.log('adding local known');
                        localUnk.known.add(localKnown);
                        const newInstances = instance.process();
                        instances = instances.concat(newInstances);
                    } else {
                        console.log('We misplaced a term');
                    }
                })
            })
        })
        // Remove instances with floating terms and unique based on instance.equals()
        instances = instances.filter((instance) => instance.getFloatingTerms().length === 0);
        instances = instances.filter((instance, i) => instances.find(j => j.equals(instance)) === instance);
        return instances;
    }

    equals(instance: Instance) {
        const thisjson = this.toJSON();
        const other = instance.toJSON();
        return JSON.stringify(thisjson) === JSON.stringify(other);
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