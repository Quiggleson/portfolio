export class Clause {
    length: number;
    knownTerms: Set<TermSet>;
    id: string;
    name: string;
    col: number;

    constructor(length: number, knownTerms: Set<TermSet>, name: string, id?: string, col?: number) {
        this.length = length;
        this.knownTerms = knownTerms;
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.name = name;
        this.col = col === undefined ? 2 : col;
    }

    toJSON() {
        return {
            name: this.name,
            id: this.id,
            length: this.length,
            columns: this.col,
            knownTerms: Array.from(this.knownTerms),
        }
    }

    // Accepts knownTerms as list
    static from(json: any) {
        return new Clause(json.length, new Set(json.knownTerms), json.name, json.id);
    }

    // Should only be used when copying for new instance as it copies the id
    copy() {
        var knownTermsCopy: Set<TermSet> = new Set();
        this.knownTerms.forEach((term) => {
            knownTermsCopy.add(term);
        })
        return new Clause(this.length, knownTermsCopy, this.name, this.id, this.col);
    }

    addTerm(instance: Instance, used?: Set<string>) {
        var usedTerms: Set<string>;
        if (used) {
            usedTerms = instance.getTermNames().union(used);
        } else {
            usedTerms = instance.getTermNames();
        }
        const nextTerm = ['α', 'β', 'δ', 'ζ', 'η', 'λ', 'μ', 'π'];
        var i = 0;
        while (i < nextTerm.length && usedTerms.has(nextTerm[i])) {i++};
        if (i == nextTerm.length) {
            this.knownTerms.add(new TermSet("A", 1));
        } else {
            this.knownTerms.add(new TermSet(nextTerm[i], 1));
        }
    }

    getTermSet(id: string) {
        const match = Array.from(this.knownTerms).filter((term) => term.id === id);
        return match.length === 0 ? undefined : match[0];
    }

    getTermNames() {
        var names = new Set<string>();
        this.knownTerms.forEach((term) => {
            names.add(term.name);
        })
        return names;
    }

    update(clause: Clause) {
        this.name = clause.name;
        this.knownTerms = clause.knownTerms;
        this.length = clause.length;
        this.id = clause.id;
        this.col = clause.col;
    }
}

export class TermSet {
    name: string;
    id: string;
    length: number;
    knownTerms: Set<TermSet>;


    constructor(name: string, length: number, knownTerms?: Set<TermSet>, id?: string) {
        this.name = name;
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.length = length;
        this.knownTerms = knownTerms === undefined ? new Set<TermSet>() : knownTerms;
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
    copy: (instance?: Instance) => Connection
}

export class Instance {
    clauses: Clause[];
    connections: Connection[];

    constructor(clauses: Clause[], connections: Connection[]) {
        this.clauses = clauses;
        this.connections = connections;
    }

    copy() {
        var newInstance = new Instance([], []);

        this.clauses.forEach((clause) => {
            newInstance.clauses.push(clause.copy());
        })

        this.connections.forEach((connection) => {
            newInstance.connections.push(connection.copy(newInstance));
        })

        return newInstance;
    }

    getClause(id: string) {
        const clauseList = this.clauses.filter((clause) => clause.id === id);
        return clauseList.length === 0 ? undefined : clauseList[0];
    }

    getConnection(id: string) {
        const conList = this.connections.filter((connection) => connection.id === id);
        return conList.length === 0 ? undefined : conList[0];
    }

    getTermNames() {
        var terms = new Set<string>();
        this.clauses.forEach((clause) => {
            terms = terms.union(clause.getTermNames())
        })
        console.log('terms: ' + JSON.stringify(Array.from(terms)));
        return terms;
    }

    getExpansions() {
        return this.connections.filter((con) => con.type === ConnectionType.expansion) as Expansion[];
    }
}

export class Implication implements Connection {
    type: ConnectionType = ConnectionType.implication;
    id: string;
    positive: Clause;
    negative: Clause;
    output: Clause;

    constructor(positive: Clause, negative: Clause, output: Clause, id?: string) {
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.positive = positive;
        this.negative = negative;
        this.output = output;
    }

    public getClauses() {
        return [this.positive, this.negative, this.output];
    }

    copy(instance?: Instance) {
        if (instance === undefined) {
            return new Implication(this.positive.copy(), this.negative.copy(), this.output.copy(), this.id);
        } else {
            return new Implication(
                instance.getClause(this.positive.id)!,
                instance.getClause(this.negative.id)!,
                instance.getClause(this.output.id)!,
                this.id
            );
        }
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

    // TODO when copying expansion (to new instance), still want the clauses to reference the same objects (in the new instance)
    copy(instance?: Instance) {
        if (instance === undefined) {
            return new Expansion(this.input.copy(), this.output.copy(), this.id);
        } else {
            return new Expansion(
                instance.getClause(this.input.id)!,
                instance.getClause(this.output.id)!,
                this.id
            );
        }
    }
}