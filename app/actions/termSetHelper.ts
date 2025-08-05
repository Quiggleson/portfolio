'use server'

import { TermSetGetter, TermSetGetterMap } from "../types/graph";
import { getInstance } from "./instanceHelper";
import { getTerm } from "./termHelper";

export async function getTermSet(termSetId: string) {
    const instance = await getInstance()
    if (!instance.termSets.has(termSetId)) {
        throw Error("TermSet " + termSetId + " not found")
    }
    return instance.termSets.get(termSetId)!
}

export async function getTermSetAttribute<K extends TermSetGetter>(termSetId: string, getter: K): Promise<TermSetGetterMap[K]> {
    const termSet = await getTermSet(termSetId)
    let data
    switch(getter) {
        case TermSetGetter.clauses:
            data = termSet.clauses
            break
        case TermSetGetter.terms:
            data = termSet.getTerms()
            break
        default:
            throw Error("Invalid Term Set Getter")
    }
    return data.map((d) => d.getData()) as TermSetGetterMap[K]
}

export async function addTerm(termSetId: string, termName: string) {
    const termSet = await getTermSet(termSetId)
    const term = await getTerm(termName)
    termSet.addTerm(term)
}