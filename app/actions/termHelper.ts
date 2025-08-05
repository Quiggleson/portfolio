'use server'

import { InstanceGetter, TermGetter, TermGetterMap, TermSetData } from "../types/graph";
import { getInstance, getInstanceAttribute } from "./instanceHelper";

export async function getTerm(termName: string) {
    const instance = await getInstance()
    if (!instance.terms.has(termName)) {
        throw Error("Term " + termName + " not found")
    }
    return instance.terms.get(termName)!
}

export async function getTermAttribute<K extends TermGetter>(termName: string, getter: K): Promise<TermGetterMap[K]> {
    const term = await getTerm(termName)
    let data
    switch (getter) {
        case TermGetter.inExcluded:
            data = term.inExcluded
            break
        case TermGetter.inKnown:
            data = term.inKnown
            break
        case TermGetter.inPlaced:
            data = term.inPlaced
            break
        case TermGetter.inTermSet:
            data = term.inTermSet
            break
        default:
            throw Error("Invalid TermGetter")
    }
    return data.map((d) => d.getData()) as TermGetterMap[K]
}

export async function getPotentialTermSets(termName: string) : Promise<TermSetData[]> {
    const term = await getTerm(termName)
    const potentialTermSets = term.getPotentialTermSets()
    return potentialTermSets.map((ts) => ts.getData())
}