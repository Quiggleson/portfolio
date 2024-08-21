'use client';

import { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { Clause, Expansion, Implication, Instance } from "./satclasses";
import { DrawConnections, RenderClause, RenderClauses, RenderConnection, RenderConnections } from "./satcomponents";
import { ConnectionsModal, ControlsModal, EditClauseModal } from "./modals";
import { downloadJSON } from "../utils/download";
import exampleinstance from '../../public/instance.json';

export default function Sat2() {
    const [, forceUpdate] = useState(0);
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
            case "i": {
                mode === '' ? setMode('longest') : setMode('');
                setSelected([]);
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
        else if (mode === 'longest' && selected.length === 0) {
            instances[current].getLongestRequiredClause(clause);
            setSelected([]);
            setMode('');
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

    async function uploadDirect(data: any) {
        console.log('File uploaded')
        const i = Instance.from(data);
        setInstances([...instances, i]);
        // setInstance(JSON.parse(await event.target.files[0].text()), setClauses, setConnections)
    }

    useEffect(() => {
        forceUpdate(n => n + 1);
        window.addEventListener("scroll", () => forceUpdate(n => n + 1));
        return () => window.removeEventListener("scroll", () => forceUpdate(n => n + 1));
    }, []);


    return (
        <div className="outline-none px-2" onKeyUpCapture={handleKeyUp} tabIndex={0}>
            <div>INFORMATION - What the heck is going on around here?</div>
            <div>For the most immediate demonstration of features, please do the following:</div>
            <div className="pl-8">
                <p>1. Click &quot;Load Example&quot;</p>
                <p className="pl-8">This will load an example implication graph and add it to the list of instances</p>
                <p>2. Switch to the Instance 1 tab</p>
                <p className="pl-8">Here you can see the clauses and connections. At this point we know clauses contains specific sets of terms, but we don&apos;t know for certain what they are. For example, we know A contains three terms so let the set &alpha; represent these three terms. Similarly, C contains four terms and A expands to C so let &delta; represent one term and we can see C contains the union of &delta; and &alpha;.</p>
                <p>3. Click &quot;PROCESS&quot;</p>
                <p className="pl-8">At this point we have some information about the instance. For example, we know that the implication between C and D which derives E means there must be some term that&apos;s positive in one clause and negated in the other. Call these terms a and -a. Additionally, we know that a must either be in &delta; or &alpha;. Additionally, we know if a is not in &alpha;, we can directly derive A from E (either by expansion or, in this case A and E are identical). Given those restrictions, this process button makes a new instance for each possible placement of each term. </p>
                <p>4. Examine the new instance</p>
                <p className="pl-8">You will see each instance places a and -a in each possible set (with the restrictions) and it gets updated in other clauses containing that set as well.</p>
                <p>5. Go to instance 2 and click &quot;Add new implications&quot;</p>
                <p className="pl-8">Because we now know the placement of the terms in the clauses, we can derive additional clauses. Notice A contains the term a and B contains the term -a so we can use these clauses to derive a new clause, F, as seen in Column 3. We also know the maximum length of F is 3 since its terms are a subset of that of E and the length of E is 3.</p>
                <p>6. Press the &quot;i&quot; key then click the E clause</p>
                <p className="pl-8">This will trace the graph to get the shortest length of the longest clause that&apos;s required to be processed to derive E. Notice the original path to derive E from A and B went through C and D which were of length 4. Now we derived a new clause, F, which is of length 3 and F is a subset of E so we only have to process a clause of length 3 to derive E. This idea of shortcutting clauses is very powerful and will hopefully be used to find K: the shortest length of the longest clause required to be processed to derive all of the clauses that can be derived. If this K is independent of the number of terminals, P = NP.</p>
            </div>
            <button
                className="block outline rounded px-2 hover:bg-button-hover my-2"
                onClick={() => setModal('help')}
            >Help</button>
            <button className="block outline outline-4 rounded px-2 hover:bg-button-hover my-4 mx-1" onClick={() => setModal('connections')}>View Connections</button>
            {/* <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => downloadJSON('exampleinstance.json', exampleinstance)}>Download Example</button> */}
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => uploadDirect(exampleinstance)}>Load Example</button>
            <p>Import</p>
            <label htmlFor="file-upload" className="block outline rounded hover:bg-button-hover my-2 w-fit px-2">Upload File</label>
            <input id="file-upload" type="file" className="hidden" onChange={uploadFile} />
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => downloadJSON('instance.json', instances[current])}>Export</button>
            <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => setInstances([...instances, instances[current].copy()])}>Copy Instance</button>
            {/* <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => checkInstance(instances[current])}>Check Instance</button> */}
            {/* <button className="block outline rounded px-2 hover:bg-button-hover my-2" onClick={() => { instances[current].addOpposites(); setInstances([...instances]) }}>Add Opposite Form Terms</button> */}
            {/* <button className="block outline outline-4 rounded px-2 hover:bg-button-hover my-4 mx-1" onClick={() => setInstances([...instances, ...instances[current].process(0, 1)])}>PROCESS (before aug 20)</button> */}
            <button className="block outline outline-4 rounded px-2 hover:bg-button-hover my-4 mx-1" onClick={() => setInstances([...instances, ...instances[current].temp_process()])}>PROCESS</button>
            <button className="block outline outline-4 rounded px-2 hover:bg-button-hover my-4 mx-1" onClick={() => {instances[current].addNewImplications(); setInstances([...instances])}}>Add new implications</button>
            <div className="flex">
                {instances.map((instance, i) =>
                    <button key={i} className={"outline rounded-t px-2 mx-1 " + (current === i ? "bg-button-hover" : "hover:bg-button-hover")} onClick={() => setCurrent(i)}>
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
            {/* <div>
                Connections:
                {instances[current].connections.map((connection, i) =>
                    <div key={connection.id + "div"}>
                        <RenderConnection
                            key={connection.id}
                            connection={connection}
                            />
                            </div>
                            )}
                            </div> */}
            <div>
                <p>Messages:</p>
                {instances[current].messages.map((message, i) =>
                    <p key={i}>{message}</p>
                )}
            </div>
            <p>Connections:</p>
            <RenderConnections
                instance={instances[current]}
            />
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
            {modal === 'connections' &&
                <ConnectionsModal
                    close={() => { setModal(''); setSelected([]); setMode(''); }}
                    instance={instances[current]}
                />
            }
            <DrawConnections
                connections={instances[current].connections}
            />
        </div>
    );
}