import { Dispatch, SetStateAction } from "react";
import { Clause, Connection, ConnectionType, Expansion, Implication, Instance, TermSet } from "./satclasses";

// Return human readable list of terms
export function getTermString(terms: Set<TermSet>) {
    var knownTermStr = '';

    Array.from(terms).forEach((term, i) => {
        knownTermStr += term.name;
        if (i !== terms.size - 1) { knownTermStr += ' U ' };
    })
    return knownTermStr;
}

// Return set from human readable list of terms
// export function getTermSet(termString: string) {
//     var knownTerms = new Set<TermSet>();

//     termString.split(',').forEach((term) => {
//         const t = term.trim().replace(',','');
//         if (t.length > 0) {
//             knownTerms.add(t);
//         }
//     })

//     return knownTerms;
// }

// used for uploading JSON files
// export function setInstance(instance: Instance, setClauses: Dispatch<SetStateAction<Clause[]>>, setConnections: Dispatch<SetStateAction<Connection[]>>, ) {
//     var clauses: Clause[] = [];
//     instance.clauses.forEach((clause) => {
//         clauses.push(Clause.from(clause));
//     })
//     setClauses(clauses);
//     setConnections(instance.connections);
// }

// Check connections are valid
// export function checkInstance(instance: Instance): string {

//     var warnings = "";

//     (instance.connections.filter((c) => c.type === ConnectionType.expansion) as Expansion[]).forEach((expansion) => {
//         if (expansion.input.length !== expansion.output.length - 1) {
//             warnings += "Clause " + expansion.input.name + " is not exactly one shorter than " + expansion.output.name + "\n";
//         }
//         if (expansion.input.knownTerms.difference(expansion.output.knownTerms).size > 0) {
//             warnings += "Clause " + expansion.output.name + " does not contain all termSets from" + expansion.input.name + ". The following terms are missing: " + JSON.stringify(Array.from(expansion.input.knownTerms.difference(expansion.output.knownTerms))) + "\n";
//         }
//     })
//     if (warnings.length === 0) {
//         warnings = "All good!"
//     }
//     console.log(warnings);
//     return warnings;
// }

// // Check whether or not the clauses in the implication contain opposite form terms
// export function checkImplication(implication: Implication) {
//     var valid = false;
//     implication.positive.oppFormTerms.forEach((term) => {
//         if (implication.negative.getTermbyName('-'+term.name) !== undefined) {
//             valid = true;
//         }
//     })
//     return valid;
// }

// Return possible scenarios based on what must be true given an expansion
// TODO currently it makes a new instance for each expansion, but want to add what must exist first and then add new possible instances
// export function processExpansions(expansions: Expansion[], instance: Instance, instances: Instance[], setInstances: Dispatch<SetStateAction<Instance[]>>) {
    
//     console.log('Processing expansions in instance: ' + JSON.stringify(instance));

//     var newInstances: Instance[] = [];

//     // Add terms that are guaranteed first
//     expansions.forEach((expansion) => {
//         // Check lengths work
//         if (expansion.input.length >= expansion.output.length) {
//             console.log('[WARNING] Expansion ' + expansion.id + 'is not possible');
//         }

//         // Confirm all terms in input exist in output
//         expansion.input.knownTerms.forEach((term, term1, knownTerms) => {
//             console.log('[INFO] Adding ' + term + ' to clause ' + expansion.output.name);
//             expansion.output.knownTerms.add(term);
//         })
//     });

//     // Add new possible instance
//     expansions.forEach((expansion) => {

//         // Iterate terms in output that do not exist in input. Create a new instance for each and add all terms in output to input except selected term
//         expansion.output.knownTerms.difference(expansion.input.knownTerms).forEach((term, term1, knownTerms) => {
//             const newInstance = instance.copy();
//             console.log('Creating new instance for ' + expansion.input.name + ' to ' + expansion.output.name);
//             // console.log('[satutils] newinstance: ' + JSON.stringify(newInstance));
//             // console.log('finding expansion with id ' + expansion.id);
//             const localExp = newInstance.getConnection(expansion.id) as Expansion;
//             localExp.output.knownTerms.difference(new Set(term)).forEach((addTerm) => {
//                 console.log('Adding ' + addTerm + ' to clause ' + expansion.input.name);
//                 // newInstance.getClause(localExp.input.id)?.knownTerms.add(addTerm);
//                 localExp.input.knownTerms.add(addTerm);
//             })
//             // processExpansions(newInstance.getExpansions(), newInstance, [...instances, newInstance], setInstances);
//             newInstances.push(newInstance);
//             console.log('Pushing new instance: ' + JSON.stringify(newInstance));
//         });

//         console.log('Adding ' + newInstances.length + ' new instance');

//     });
//     setInstances([...instances, ...newInstances]);
// }