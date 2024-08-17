export class Clause {
    length: number;
    knownTerms: Set<string>;
    id: string;
    name: string;

    constructor(length: number, knownTerms: Set<string>, name: string, id?: string) {
        this.length = length;
        this.knownTerms = knownTerms;
        this.id = id === undefined ? crypto.randomUUID() : id;
        this.name = name;
    }

    toJSON() {
        return {
            name: this.name,
            id: this.id,
            length: this.length,
            knownTerms: Array.from(this.knownTerms),
        }
    }

    // Accepts knownTerms as list
    static from(json: any) {
        return new Clause(json.length, new Set(json.knownTerms), json.name, json.id);
    }

    // Should only be used when copying for new instance as it copies the id
    copy() {
        var knownTermsCopy: Set<string> = new Set();
        this.knownTerms.forEach((term) => {
            knownTermsCopy.add(term);
        })
        return new Clause(this.length, knownTermsCopy, this.name, this.id);
    }

    addTerm(instance: Instance) {
        const usedTerms = instance.getTerms();
        console.log('checking instance: ' + JSON.stringify(instance));
        console.log('used terms: ' + JSON.stringify(Array.from(usedTerms)));
        const nextTerm = 'abcdefghijklmnopqrstuvwxyz';
        var i = 0;
        while (i < 26 && usedTerms.has(nextTerm[i])) { i++ };
        if (i === 26) {
            this.knownTerms.add('a');
        } else {
            this.knownTerms.add(nextTerm[i]);
        }
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
        return clauseList.length === 0 ? null : clauseList[0];
    }

    getConnection(id: string) {
        const conList = this.connections.filter((connection) => connection.id === id);
        return conList.length === 0 ? null : conList[0];
    }

    getTerms() {
        var terms = new Set<string>();
        this.clauses.forEach((clause) => {
            terms = terms.union(clause.knownTerms);
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