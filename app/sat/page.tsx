'use client';

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Clause, Connection, ConnectionType, Expansion, Implication, Instance } from "./satclasses";
import { createClause, processExpansions, setInstance } from "./satutils";
import { RenderClause, RenderClauses, RenderConnection } from "./satcomponents";
import { ControlsModal, EditClauseModal } from "./modals";

export default function Sat2() {
    const [connectionMode, setConnectionMode] = useState('');
    const [clauses, setClauses] = useState<Clause[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selected, setSelected] = useState<Clause[]>([]);
    const [lastLength, setLastLength] = useState(3);
    const [modal, setModal] = useState('');
    const [instances, setInstances] = useState<Instance[]>([new Instance([], [])]);
    const [curInstanceIdx, setCurInstanceIdx] = useState(0);

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (modal !== '') {
            return;
        }

        switch (event.key) {
            case "Shift": {
                if (connectionMode === '') { setConnectionMode('expansion') };
                break;
            }
            case "Control": {
                if (connectionMode === '') { setConnectionMode('implication') };
                break;
            }
            case 'e': {
                if (connectionMode === '') { setConnectionMode('edit') };
                break;
            }
            case 'c': {
                if (connectionMode === '') { setConnectionMode('copy') };
                break;
            }
            case 't': {
                if (connectionMode === '') {setConnectionMode('newTerm')};
            }
            default: {
                console.log("[INFO] Unrecognized key down: " + event.key);
                break;
            }
        }
    }

    function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (modal !== '') {
            return;
        }

        switch (event.key) {
            case "Shift": {
                setConnectionMode('');
                setSelected([]);
                break;
            }
            case "Control": {
                setConnectionMode('');
                setSelected([]);
                break;
            }
            case "e": {
                setConnectionMode('');
                setSelected([]);
                break;
            }
            case "n": {
                setClauses([...clauses, createClause(undefined, 3, [], clauses)]);
                break;
            }
            case "h": {
                setModal('controls');
                break;
            }
            case 'c': {
                setConnectionMode('');
                setSelected([]);
            }
            case 't': {
                setConnectionMode('');
                setSelected([]);
            }
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
            setConnections([...connections, new Expansion(selected[0], clause)]);
            setConnectionMode('');
            setSelected([]);
        }
        else if (connectionMode === 'implication' && selected.length === 2) {
            setConnections([...connections, new Implication(selected[0], selected[1], clause)])
            setConnectionMode('');
            setSelected([]);
        }
        else if (connectionMode === 'edit' && selected.length === 0) {
            setModal('editclause');
        }
        else if (connectionMode === 'copy' && selected.length === 0) {
            setClauses([...clauses, createClause(undefined, clause.length, Array.from(clause.knownTerms), clauses)]);
            setSelected([]);
        } else if (connectionMode === 'newTerm') {
            instances[curInstanceIdx].getClause(clause.id)?.addTerm(instances[curInstanceIdx]);
            setSelected([]);
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
        <div className="outline-none px-2" onKeyDown={handleKeyDown} onKeyUpCapture={handleKeyUp} tabIndex={0}>
            <div>
                Click anywhere above the rendered content to start listening for commands (it&apos;s being finicky sorry)<br />
                WARNING: when using various modes, you sometimes have to click the instance tab of the current instance to reset the clauses and whatnot. Instances are new and I&apos;m currently in the process of making actions interface with the instances rather than a single list of clauses
            </div>
            <button
                className="block outline rounded px-2 hover:bg-button-hover my-2"
                onClick={() => setModal('help')}
            >Help</button>
            <p>Import</p>
            <label htmlFor="file-upload" className="block outline rounded hover:bg-button-hover my-2 w-fit px-2">Upload File</label>
            <input id="file-upload" type="file" className="hidden" onChange={uploadFile} />
            {/* <input id="file-upload" type="file" className="block outline rounded hover:bg-button-hover my-2 w-fit" onChange={uploadFile} /> */}
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={downloadJSON}>Export</button>
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => processExpansions(instances[curInstanceIdx].connections.filter((c) => (c.type === ConnectionType.expansion)) as Expansion[], instances[curInstanceIdx], instances, setInstances)}>Process Expansions</button>
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={copyInstance}>Copy Instance</button>
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
                    clauses={clauses}
                    handleClick={handleClick}
                />
            </div>
            <div>
                Connections:
                {connections.map((connection, i) =>
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
                    clauses={clauses}
                    setClauses={setClauses}
                    connections={connections}
                    setConnections={setConnections}
                />}
            {modal === 'help' &&
                <ControlsModal
                    close={() => { setModal(''); setSelected([]); setConnectionMode(''); }}
                />
            }
        </div>
    );
}