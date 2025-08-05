'use server'

import { getInstance } from "./instanceHelper"
import { ClauseGetter, ClauseGetterMap, TermData, TermSetData } from "../types/graph"
import { getTerm } from "./termHelper"
import { getTermSet } from "./termSetHelper"

export async function getClause(clauseId: string) {
    const instance = await getInstance()
    if (!instance.clauses.has(clauseId)) {
        throw Error('Clause ' + clauseId + ' not in instance')
    }
    return instance.clauses.get(clauseId)!
}

export async function getClauseAttribute<K extends ClauseGetter>(clauseId: string, getter: K) : Promise<ClauseGetterMap[K]> {
    const clause = await getClause(clauseId)
    let data
    switch (getter) {
        case ClauseGetter.termSets:
            data = clause.getTermSets()
            break
        case ClauseGetter.known:
            data = clause.known
            break
        case ClauseGetter.placed:
            data = clause.placed
            break
        case ClauseGetter.excluded:
            data = clause.excluded
            break
        case ClauseGetter.intoExpansions:
            data = clause.intoExpansions
            break
        case ClauseGetter.fromExpansions:
            data = clause.fromExpansions
            break
        case ClauseGetter.fromImplications:
            data = clause.intoImplications
            break
        case ClauseGetter.intoImplications:
            data = clause.intoImplications
            break
        default:
            throw Error("Invalid Clause Getter")
    }
    return data.map((d) => d.getData()) as ClauseGetterMap[K]
}

export async function setLength(id: string, length: number) {
    const clause = await getClause(id)
    clause.length = length
    return clause.getData()
}