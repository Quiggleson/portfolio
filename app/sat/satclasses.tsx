export class Clause{
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

export interface Instance {
    clauses: Clause[],
    connections: Connection[]
}

export class Implication implements Connection {
    type: ConnectionType = ConnectionType.implication;
    id: string;
    positive: Clause;
    negative: Clause;
    output: Clause;

    constructor(positive: Clause, negative: Clause, output: Clause) {
        this.id = crypto.randomUUID();
        this.positive = positive;
        this.negative = negative;
        this.output = output;
    }

    public getClauses(){
        return [this.positive, this.negative, this.output];
    }
}

export class Expansion implements Connection {
    type: ConnectionType = ConnectionType.expansion;
    id: string;
    input: Clause;
    output: Clause

    public constructor(input: Clause, output: Clause) {
        this.id = crypto.randomUUID();
        this.input = input;
        this.output = output;
    }

    public getClauses() {
        return [this.input, this.output];
    }
}