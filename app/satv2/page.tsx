'use client';

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Clause, Connection, ConnectionType, Expansion, Implication, Instance, TermSet } from "./satclasses";
import { createClause, setInstance } from "./satutils";
import { RenderClause, RenderClauses, RenderConnection, RenderConnections } from "./satcomponents";
import { ControlsModal, EditClauseModal } from "./modals";

export default function Sat2() {
    const [connectionMode, setConnectionMode] = useState('');
    const [clauses, setClauses] = useState<Clause[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selected, setSelected] = useState<Clause[]>([]);
    const [modal, setModal] = useState('');
    const [instances, setInstances] = useState<Instance[]>([new Instance([], [])]);
    const [curInstanceIdx, setCurInstanceIdx] = useState(0);

    function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (modal !== '') {
            return;
        }

        switch (event.key) {
            case "Shift": {
                connectionMode === '' ? setConnectionMode('expansion') : setConnectionMode('');
                setSelected([]);
                break;
            }
            case "Control": {
                connectionMode === '' ? setConnectionMode('implication') : setConnectionMode('');
                setSelected([]);
                break;
            }
            case "e": {
                connectionMode === '' ? setConnectionMode('edit') : setConnectionMode('');
                setSelected([]);
                break;
            }
            case "n": {
                const c = createClause(undefined, 3, [], instances[curInstanceIdx].clauses);
                c.addTerm(instances[curInstanceIdx]);
                instances[curInstanceIdx].clauses.push(c);
                setInstances([...instances]);
                console.log('creating clause ' + JSON.stringify(c));
                console.log('instances: ' + JSON.stringify(instances));
                console.log('curInstanceIdx: ' + curInstanceIdx);
                break;
            }
            case "h": {
                setModal('help');
                break;
            }
            // case 'c': {
            //     connectionMode === '' ? setConnectionMode('copy') : setConnectionMode('');
            //     setSelected([]);
            // }
            // case 't': {
            //     connectionMode === '' ? setConnectionMode('newTerm') : setConnectionMode('');
            //     setSelected([]);
            // }
            default: {
                console.log("[INFO] Unrecognized key up " + event.key);
                break;
            }
        }
    }

    function handleClick(clause: Clause) {
        if (modal !== '' || connectionMode === '') {
            return;
        }

        console.log('I got clicked! ' + clause.id);
        if (!selected.includes(clause)) {
            setSelected([...selected, clause]);
        }
        if (connectionMode === 'expansion' && selected.length === 1) {
            const e = new Expansion(selected[0], clause);
            instances[curInstanceIdx].connections.push(e);
            setConnectionMode('');
            setSelected([]);
        }
        else if (connectionMode === 'implication' && selected.length === 2) {
            const i = new Implication(selected[0], selected[1], clause);
            instances[curInstanceIdx].connections.push(i);
            setConnectionMode('');
            setSelected([]);
        }
        else if (connectionMode === 'edit' && selected.length === 0) {
            console.log('Instance: ' + JSON.stringify(instances[curInstanceIdx]));
            setModal('editclause');
        // }
        // else if (connectionMode === 'copy' && selected.length === 0) {
        //     setClauses([...clauses, createClause(undefined, clause.length, Array.from(clause.knownTerms), clauses)]);
        //     setSelected([]);
        // } else if (connectionMode === 'newTerm') {
        //     instances[curInstanceIdx].getClause(clause.id)?.addTerm(instances[curInstanceIdx]);
        //     setSelected([]);
        }
    }

    const downloadJSON = () => {
        const obj = {
            "clauses": clauses,
            "connections": connections
        }
        const jsonString = JSON.stringify(obj);
        console.log(jsonString);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "myObject.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
        console.log('File uploaded')
        if (event.target.files !== null) {
            setInstance(JSON.parse(await event.target.files[0].text()), setClauses, setConnections)
            event.target.files = null;
        }
    }

    function switchInstance(newInstanceIdx: number) {
        instances[curInstanceIdx].clauses = clauses;
        instances[curInstanceIdx].connections = connections;
        setClauses(instances[newInstanceIdx].clauses);
        setConnections(instances[newInstanceIdx].connections);
        setCurInstanceIdx(newInstanceIdx);
    }

    function copyInstance() {
        switchInstance(curInstanceIdx);
        const newInstance = instances[curInstanceIdx].copy();
        setInstances([...instances, newInstance]);
    }

    return (
        <div className="outline-none px-2" onKeyUpCapture={handleKeyUp} tabIndex={0}>
            <div>
                This is the second version of an interactive 3sat instance. This version will be focused on creating clauses with unknown terms as opposed to working with strictly defined clauses.
            </div>
            <button
                className="block outline rounded px-2 hover:bg-button-hover my-2"
                onClick={() => setModal('help')}
            >Help</button>
            {/* <p>Import</p>
            <label htmlFor="file-upload" className="block outline rounded hover:bg-button-hover my-2 w-fit px-2">Upload File</label>
            <input id="file-upload" type="file" className="hidden" onChange={uploadFile} />
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={downloadJSON}>Export</button>
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={copyInstance}>Copy Instance</button> */}
            <div className="flex">
                {instances.map((instance, i) => 
                <button key={i} className={"outline rounded-t px-2 mx-1 "  + (curInstanceIdx === i ? "bg-button-hover" : "hover:bg-button-hover")} onClick={() => switchInstance(i)}>
                    Instance {i}
                </button>
                )}
            </div>
            <div>
                Clauses:
                <RenderClauses
                    clauses={instances[curInstanceIdx].clauses}
                    handleClick={handleClick}
                />
            </div>
            <div>
                Connections:
                {instances[curInstanceIdx].connections.map((connection, i) =>
                    <div key={connection.id + "div"}>
                        <RenderConnection
                            key={connection.id}
                            connection={connection}
                        />
                    </div>
                )}
            </div>
            <div>
                Selected:
                {selected.map((clause, i) =>
                    <div key={clause.id + "selecteddiv"}>
                        <RenderClause
                            key={clause.id}
                            clause={clause}
                        />
                    </div>
                )}
            </div>
            <div>Mode: {connectionMode}</div>
            {modal === 'editclause' &&
                <EditClauseModal
                    clause={selected[0]}
                    close={() => { setModal(''); setSelected([]); setConnectionMode(''); }}
                    instance={instances[curInstanceIdx]}
                />}
            {modal === 'help' &&
                <ControlsModal
                    close={() => { setModal(''); setSelected([]); setConnectionMode(''); }}
                />
            }
            <RenderConnections 
                connections={instances[curInstanceIdx].connections}
            />
        </div>
    );
}