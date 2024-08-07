'use client';

import { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { Clause, Expansion, Implication, Instance } from "./satclasses";
import { RenderClause, RenderClauses, RenderConnection, RenderConnections } from "./satcomponents";
import { ControlsModal, EditClauseModal } from "./modals";
import { downloadJSON } from "../utils/download";
import exampleinstance from '../../public/instance.json';

export default function Sat2() {
    const [mode, setMode] = useState('');
    const [modal, setModal] = useState('');
    const [selected, setSelected] = useState<Clause[]>([]);
    const [instances, setInstances] = useState<Instance[]>([new Instance([], [])]);
    // idx of instance
    const [current, setCurrent] = useState(0);

    function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (modal !== '') {
            return;
        }

        switch (event.key) {
            case "Shift": {
                mode === '' ? setMode('expansion') : setMode('');
                setSelected([]);
                break;
            }
            case "Control": {
                mode === '' ? setMode('implication') : setMode('');
                setSelected([]);
                break;
            }
            case "e": {
                mode === '' ? setMode('edit') : setMode('');
                setSelected([]);
                break;
            }
            case "n": {
                const c = instances[current].addClause();
                instances[current].addUnknown(c);
                setInstances([...instances]);
                break;
            }
            case "h": {
                setModal('help');
                break;
            }
            // case 'c': {
            //     mode === '' ? setMode('copy') : setMode('');
            //     setSelected([]);
            // }
            // case 't': {
            //     mode === '' ? setMode('newTerm') : setMode('');
            //     setSelected([]);
            // }
            default: {
                console.log("[INFO] Unrecognized key up " + event.key);
                break;
            }
        }
    }

    function handleClick(clause: Clause) {
        if (modal !== '' || mode === '') {
            return;
        }

        if (!selected.includes(clause)) {
            setSelected([...selected, clause]);
        }
        if (mode === 'expansion' && selected.length === 1) {
            const e = new Expansion(selected[0], clause);
            instances[current].connections.push(e);
            setMode('');
            setSelected([]);
        }
        else if (mode === 'implication' && selected.length === 2) {
            const i = new Implication(selected[0], selected[1], clause);
            instances[current].connections.push(i);
            setMode('');
            setSelected([]);
        }
        else if (mode === 'edit' && selected.length === 0) {
            console.log('Instance: ' + JSON.stringify(instances[current]));
            console.log('floating terms: ' + JSON.stringify(instances[current].getFloatingTerms()))
            setModal('editclause');
        // }
        // else if (mode === 'copy' && selected.length === 0) {
        //     setClauses([...clauses, createClause(undefined, clause.length, Array.from(clause.knownTerms), clauses)]);
        //     setSelected([]);
        // } else if (mode === 'newTerm') {
        //     instances[current].getClause(clause.id)?.addTerm(instances[current]);
        //     setSelected([]);
        }
    }

    // const downloadJSON = (filename: string) => {
    //     // const obj = instances[current].toJSON();
    //     const jsonString = JSON.stringify(instances[current]);
    //     console.log(jsonString);
    //     const blob = new Blob([jsonString], { type: "application/json" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = "myObject.json";
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    // };

    async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
        console.log('File uploaded')
        if (event.target.files !== null) {
            const i = Instance.from(JSON.parse(await event.target.files[0].text()));
            setInstances([...instances, i]);
            // setInstance(JSON.parse(await event.target.files[0].text()), setClauses, setConnections)
            event.target.files = null;
        }
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
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => downloadJSON('exampleinstance.json', exampleinstance)}>Download Example</button>
            <p>Import</p>
            <label htmlFor="file-upload" className="block outline rounded hover:bg-button-hover my-2 w-fit px-2">Upload File</label>
            <input id="file-upload" type="file" className="hidden" onChange={uploadFile} />
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => downloadJSON('instance.json', instances[current])}>Export</button>
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => setInstances([...instances, instances[current].copy()])}>Copy Instance</button>
            {/* <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => checkInstance(instances[current])}>Check Instance</button> */}
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => {instances[current].addOpposites(); setInstances([...instances])}}>Add Opposite Form Terms</button>
            <button className="block outline outline-4 rounded px-2 hover:bg-button-hover my-4 mx-1" onClick={() => setInstances([...instances, ...instances[current].process()])}>PROCESS</button>
            <div className="flex">
                {instances.map((instance, i) => 
                <button key={i} className={"outline rounded-t px-2 mx-1 "  + (current === i ? "bg-button-hover" : "hover:bg-button-hover")} onClick={() => setCurrent(i)}>
                    Instance {i}
                </button>
                )}
            </div>
            <div>
                Clauses:
                <RenderClauses
                    clauses={instances[current].clauses}
                    handleClick={handleClick}
                />
            </div>
            <div>
                Connections:
                {instances[current].connections.map((connection, i) =>
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
            <div>Mode: {mode}</div>
            {modal === 'editclause' &&
                <EditClauseModal
                    clause={selected[0]}
                    close={() => { setModal(''); setSelected([]); setMode(''); }}
                    instance={instances[current]}
                />}
            {modal === 'help' &&
                <ControlsModal
                    close={() => { setModal(''); setSelected([]); setMode(''); }}
                />
            }
            <RenderConnections 
                connections={instances[current].connections}
            />
        </div>
    );
}