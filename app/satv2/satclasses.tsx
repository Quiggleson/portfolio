export class Clause {
    id: string;
    name: string;
    length: number;
    col: number;
    known: Set<TermSet>;
    unknown: Set<TermSet>;

    constructor(name: string, length: number, col: number, unknown?: Set<TermSet>, known?: Set<TermSet>, id?: string) {
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.name = name;
        this.length = length;
        this.col = col === undefined ? 2 : col;
        this.known = known === undefined ? new Set<TermSet>() : known;
        this.unknown = unknown === undefined ? new Set<TermSet>() : unknown;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            length: this.length,
            col: this.col,
            known: Array.from(this.known),
            unknown: Array.from(this.unknown)
        }
    }

    // Reads known and unknown as lists
    // WARNING, if the same term exists in known and unknown, it will get buggy
    static from(json: any, instance: Instance) {
        const c = instance.getClause(json.id);
        if (c) { return c };
        return new Clause(
            json.name,
            json.length,
            json.col,
            TermSet.fromList(json.unknown, instance),
            TermSet.fromList(json.known, instance),
            json.id
        );
    }

    static fromList(json: any, instance: Instance) {
        json.forEach((clause: any) => {
            instance.clauses.push(Clause.from(clause, instance));
        })
    }

    // Should only be used when copying for new instance as it copies the id
    copy() {
        var knownCopy= new Set<TermSet>();
        var unknownCopy = new Set<TermSet>();
        this.known.forEach((term) => {
            knownCopy.add(term);
        })
        this.unknown.forEach((term) => {
            unknownCopy.add(term);
        })
        return new Clause(this.name, this.length, this.col, unknownCopy, knownCopy, this.id);
    }

    addKnown(term: TermSet) {
        this.known.add(term);
    }

    addUnknown(term: TermSet) {
        this.known.add(term);
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
        return this.known.union(this.unknown);
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
        if (t) {return t};
        var known = new Set<TermSet>();
        json.known.forEach((term: any) => {
            known.add(TermSet.from(term, instance));
        })

        return new TermSet(
            json.name,
            json.length,
            known,
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

    addKnown(clause: Clause): string {
        const used = this.getTermNames().union(clause.getTermNames());
        const names = 'abcdefghijklmnopqrstuvwxyz';
        var i = 0;
        while (i < names.length && used.has(names[i])) {i++};
        if (i === names.length) {
            clause.known.add(new TermSet('a', 1));
            return 'a';
        } else {
            clause.known.add(new TermSet(names[i], 1));
            return names[i];
        }
    }

    addUnknown(clause: Clause) {
        const used = this.getTermNames().union(clause.getTermNames());
        const names = ['α', 'β', 'δ', 'ζ', 'η', 'λ', 'μ', 'π'];
        var i = 0;
        while (i < names.length && used.has(names[i])) {i++};
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
        while (i < names.length && used.has(names[i])) {i++};
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
            if (!im.processed) {
                const termName = this.addKnown(im.positive);
                im.negative.addKnown(new TermSet('-' + termName, 1));
                im.processed = true;
            }
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