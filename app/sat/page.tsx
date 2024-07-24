'use client';

import { useState, KeyboardEvent } from "react";
import { Clause, Connection, Expansion, Implication } from "./satclasses";
import { createClause } from "./satutils";
import { RenderClause, RenderClauses, RenderConnection } from "./satcomponents";
import { ControlsModal, EditClauseModal } from "./modals";

export default function Sat2() {
    const [connectionMode, setConnectionMode] = useState('');
    const [clauses, setClauses] = useState<Clause[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selected, setSelected] = useState<Clause[]>([]);
    const [lastLength, setLastLength] = useState(3);
    const [modal, setModal] = useState('');

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
                if (connectionMode === '') {setConnectionMode('copy')};
                break;
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
        }
    }

    return (
        <div className="outline-none px-2" onKeyDown={handleKeyDown} onKeyUpCapture={handleKeyUp} tabIndex={0}>
            <div>
                Click me to start listening for commands
            </div>
            <button
                className="outline rounded px-2 hover:bg-purple-light"
                onClick={() => setModal('help')}
            >Help</button>
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
                    close={() => {setModal(''); setSelected([]); setConnectionMode(''); }}
                />
            }
        </div>
    );
}