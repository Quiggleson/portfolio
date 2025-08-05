import { randomUUID } from "crypto";
import { Clause } from "./Clause";
import { ExpansionData, ImplicationData } from "@/app/types/graph";

export class Implication {
    id: string
    input: Array<Clause>
    output: Clause

    constructor(input: Array<Clause>, output: Clause) {
        if (new Set([...input, output]).size !== 3) {
            throw new Error("Invalid Implication Creation")
        }

        this.input = input
        this.output = output
        this.id = randomUUID()
    }

    /**
     * @returns ImplicationData of this object
     */
    getData() : ImplicationData {
        return {
            id: this.id,
            input: [
                this.input[0].getData(),
                this.input[1].getData()
            ],
            output: this.output.getData()
        }
    }
}

export class Expansion {
    id: string
    input: Clause
    output: Clause

    constructor(input: Clause, output: Clause) {
        if (new Set([input, output]).size !== 2) {
            throw new Error("Invalid Expansion Creation")
        }

        this.input = input
        this.output = output
        this.id = randomUUID()
    }

    /**
     * @returns ExpansionData of this object
     */
    getData() : ExpansionData {
        return {
            id: this.id,
            input: this.input.getData(),
            output: this.output.getData()
        }
    }
}

