'use server'

import { cookies } from 'next/headers'
import { deleteInstance, getOrCreateInstance } from '../lib/graph/instanceStore'
import { ClauseData, ExpansionData, ImplicationData, InstanceGetter, InstanceGetterMap, TermData, TerminalData, TermSetData } from '../types/graph'
import { getClause } from './clauseHelper'

export async function getInstance() {
  const sessionId = cookies().get('session-id')?.value
  if (!sessionId) throw new Error('Session ID missing')

  const instance = getOrCreateInstance(sessionId)
  return instance
}

export async function resetInstance() {
  const sessionId = cookies().get('session-id')?.value
  if (!sessionId) throw new Error('Session ID missing')

  deleteInstance(sessionId)
}

export async function resetPlacements() {
  const instance = await getInstance()
  instance.resetPlacements()
}

export async function getInstanceData(){
  const instance = await getInstance()
  return instance.getData()
}

export async function getInstanceAttribute<K extends InstanceGetter>(getter: K): Promise<InstanceGetterMap[K]>{
  const instance = await getInstance()
  let data
  switch (getter) {
    case InstanceGetter.clauses:
      data = Array.from(instance.clauses.values())
      break
    case InstanceGetter.expansions:
      data = Array.from(instance.expansions.values())
      break
    case InstanceGetter.implications:
      data = Array.from(instance.implications.values())
      break
    case InstanceGetter.termSets:
      data = Array.from(instance.termSets.values())
      break
    case InstanceGetter.terminals:
      data = instance.terminals
      break
    case InstanceGetter.terms:
      data = Array.from(instance.terms.values())
      break
    default:
      throw Error("Invalid Instance Getter")
  }
  return data.map((d) => d.getData()) as InstanceGetterMap[K]
}

export async function addClause() {
  const instance = await getInstance()
  instance.addClause()
}

export async function addTerminal() {
  const instance = await getInstance()
  instance.addTerminal()
}

export async function addExpansion(inputData: ClauseData, outputData: ClauseData) {
  const instance = await getInstance()
  const input = await getClause(inputData.id)
  const output = await getClause(outputData.id)
  const expansion = instance.addExpansion(input, output)
  return expansion.getData()
}

export async function addImplication(inputData: ClauseData[], outputData: ClauseData) {
  const instance = await getInstance()
  const inputs = await Promise.all(inputData.map((d) => getClause(d.id)))
  const output = await getClause(outputData.id)
  const implication = instance.addImplication(inputs, output)
  return implication.getData()
}

export async function addForcedPlacements() {
  const instance = await getInstance()
  instance.addForcedPlacements()
}

export async function addForcedImplications() {
  const instance = await getInstance()
  instance.addForcedImplications()
}


export async function addForcedExpansions() {
  const instance = await getInstance()
  instance.addForcedExpansions()
}

export async function deleteClause(id: string) {
  const instance = await getInstance()
  instance.deleteClause(id)
}

export async function deleteImplication(id: string) {
  const instance = await getInstance()
  instance.deleteImplication(id)
}

export async function deleteExpansion(id: string) {
  const instance = await getInstance()
  instance.deleteExpansion(id)
}