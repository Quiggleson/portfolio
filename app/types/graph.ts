export type InstanceData = {
    clauses: Map<string, ClauseData>,
    expansions: ExpansionData[],
    implications: ImplicationData[],

}

export type ClauseData = {
    id: string
    name: string
    length: number
    termSets: TermSetData[]
    known: TermData[],
    placed: TermData[],
    excluded: TermData[]
}

export type TermSetData = {
    id: string
    name: string
    length: number
}

export type TerminalData = {
    name: string
    positive: string
    negative: string
}

export type TermData = {
    name: string,
    inTermSets: TermSetData[]
}

export type ExpansionData = {
    id: string
    input: ClauseData
    output: ClauseData
}

export type ImplicationData = {
    id: string
    input: ClauseData[],
    output: ClauseData
}

export enum ClauseGetter {
    termSets,
    known,
    placed,
    excluded,
    intoExpansions,
    fromExpansions,
    intoImplications,
    fromImplications
}

export type ClauseGetterMap = {
    [ClauseGetter.termSets]: TermSetData[]
    [ClauseGetter.known]: TermData[]
    [ClauseGetter.placed]: TermData[]
    [ClauseGetter.excluded]: TermData[]
    [ClauseGetter.intoExpansions]: ExpansionData[]
    [ClauseGetter.fromExpansions]: ExpansionData[]
    [ClauseGetter.intoImplications]: ImplicationData[]
    [ClauseGetter.fromImplications]: ImplicationData[]

}

export enum InstanceGetter {
    clauses,
    expansions,
    implications,
    terminals,
    termSets,
    terms
}

export type InstanceGetterMap = {
    [InstanceGetter.clauses]: ClauseData[],
    [InstanceGetter.expansions]: ExpansionData[],
    [InstanceGetter.implications]: ImplicationData[],
    [InstanceGetter.terminals]: TerminalData[],
    [InstanceGetter.termSets]: TermSetData[],
    [InstanceGetter.terms]: TermData[]
}


export enum TermSetGetter {
    terms,
    clauses
}

export type TermSetGetterMap = {
    [TermSetGetter.terms]: TermData[],
    [TermSetGetter.clauses]: ClauseData[]
}

export enum TermGetter {
    inKnown,
    inPlaced,
    inExcluded,
    inTermSet
}

export type TermGetterMap = {
    [TermGetter.inKnown]: ClauseData[]
    [TermGetter.inPlaced]: ClauseData[]
    [TermGetter.inExcluded]: ClauseData[]
    [TermGetter.inTermSet]: TermSetData[]
}