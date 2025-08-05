import { create } from 'zustand'
import { ClauseData } from '@/app/types/graph'

export enum Mode {
  addExpansion,
  addImplication,
  waiting,
  placeTermModal,
  clauseModal
}


export enum WorkflowStep {
  AddingClauses,
  PlacingTerms,
  Done
}

// Define the store type
type GraphStore = {
  selectedClauses: ClauseData[]
  hiddenClauses: Set<string>
  hiddenExpansions: Set<string>
  hiddenImplications: Set<string>
  mode: Mode
  workflowStep: WorkflowStep
  refreshVersion: number

  setSelectedClauses: (clauses: ClauseData[]) => void
  setHiddenClauses: (clauses: Set<string>) => void
  setHiddenExpansions: (expansions: Set<string>) => void
  setHiddenImplications: (implications: Set<string>) => void
  addSelectedClause: (clause: ClauseData) => void
  removeSelectedClause: (clauseId: string) => void

  setMode: (mode: Mode) => void
  setWorkflowStep: (step: WorkflowStep) => void

  bumpRefresh: () => void
}

// Create the store
export const useGraphStore = create<GraphStore>((set) => ({
  selectedClauses: [],
  hiddenClauses: new Set(),
  hiddenExpansions: new Set(),
  hiddenImplications: new Set(),
  mode: Mode.waiting,
  workflowStep: WorkflowStep.AddingClauses,
  refreshVersion: 0,

  setSelectedClauses: (clauses) => set({ selectedClauses: clauses }),
  addSelectedClause: (clause) =>
    set((state) => ({
      selectedClauses: [...state.selectedClauses, clause],
    })),
  setHiddenClauses: (clauses) => set({ hiddenClauses: clauses }),
  setHiddenExpansions: (e) => set({ hiddenExpansions: e }),
  setHiddenImplications: (i) => set({ hiddenImplications: i }),
  removeSelectedClause: (clauseId) =>
    set((state) => ({
      selectedClauses: state.selectedClauses.filter(c => c.id !== clauseId),
    })),

  setMode: (mode) => set({ mode }),
  setWorkflowStep: (workflowStep) => set({ workflowStep }),
  bumpRefresh: () => set((state) => ({ refreshVersion: state.refreshVersion + 1 }))
}))
