export default function SatRefactor() {
    return (<div>
        <h1 className="font-bold">SAT Refactor</h1>
        <p>Alas the current sat page got rather messy, but I did gain some intuition about how it all should work so I'll redefine a list of requirements to establish a cleaner outline before diving right in. Cheerio.</p>
        <p>What do I want to do with it:</p>
        <ul className="list-inside list-disc">
            <li>Main goal: Add partially completed implication graphs and return all possible terminal paths</li>
            <li>For example, I know four 3-t clauses can expand to 5-t clauses and reduce back down to the target 3-t clause, but I want to know every possible path of each terminal so I can say "for every possible implication in which a group of 3-t clauses imply another 3-t clause and process a 5-t clause in an intermediate step, the implication graph can be collapsed such that the longest clause required to be processed is a 4-t clause."</li>
            <li>So what tools are necessary to do this?</li>
            <li>Add a clause with 1) a fixed length, 2) a given name, 3) allow some terms to be unknown</li>
            <li>One button to create a new 3-t clause</li>
            <li>One button to create a new clause of the same length as the last created clause</li>
            <li>Connection mode (I'm thinking something like holding shift will set this mode) in which I can click two clauses and establish a connection</li>
            <li>Regarding connection mode, let's say Shift + click clause1 + click clause2 =&#62; Establish that clause1 can expand to clause2 (only support expansions by 1 term initially)</li>
            <li>Ctrl + clause1 + clause2 + clause3 =&#62; Establish that clause1 and clause2 share one opposite form term and can derive clause3</li>
        </ul>
        <p className="font-bold">Logistics</p>
        <p>page.tsx holds state and components and whatnot</p>
        <p>States:</p>
        <ul className="list-disc list-inside">
            <li>connectionMode, setConnectionMode: 'expansion', 'implication', ''</li>
            <li>clauses, setClauses: list of clauses</li>
            <li>connections, setConnections: list of connections</li>
            <li>lastLength, setLastLength: int (for creating a new clause of the last length)</li>
        </ul>
        <p>Clauses (class)</p>
        <ul className="list-disc list-inside">
            <li>length: int</li>
            <li>knownTerms: Set&#60;string&#62;</li>
            <li>id: string</li>
            <li>name: string</li>
        </ul>
        <p>Connections (interface)</p>
        <ul className="list-disc list-inside">
            <li>type: enum ('expansion', 'implication')</li>
        </ul>
        <p>Expansion (implements Connection)</p>
        <ul className="list-disc list-inside">
            <li>type: 'expansion'</li>
            <li>input: Clause</li>
            <li>output: Clause</li>
        </ul>
        <p>Implication (implements Connection)</p>
        <ul className="list-disc list-inside">
            <li>type: 'implication'</li>
            <li>positive: Clause (clause with positive form of term)</li>
            <li>negative: Clause (clause with negative form of term)</li>
            <li>output: Clause</li>
        </ul>
        <p>And now, of course, something to render the clauses and connections</p>
        <p>RenderGraph</p>
        <ul className="list-disc list-inside">
            <li>Draw the clauses and lines</li>
        </ul>
        <p>satutils.tsx</p>
        <ul className="list-disc list-inside">
            <li>createClause(name, length, knownterms, clauses) - any parameter can be undefined, in which case generates values. The generated name is the next available name in the list 'ABC...Z' (iterate clauses to get next available name). Default length is 3. Default knownTerms is an empty set of strings.</li>
            <li>createImplication(positive, negative, output) - all params are clauses</li>
            <li>createExpansion(input, output) - all params are clauses</li>
            <li>Lol jk the createImplication and createExpansion are one line, so we can just call new Implication() wherever this function would've been called (the logic for validity and whatnot should then go in the constructor)</li>
        </ul>
        <p>Cool, I think it's rather complete for initial proof of concept. The following commands work (as of Jul 24): h, n, c, e, Shift, Control as well as rendering clauses (right now does a kind of bin sort by length).</p>
        <div>Next steps are</div>
        <ul className="list-disc list-inside">
            <li>Render Lines</li>
            <li>Export and import</li>
            <li>Process Expansion with one unknown</li>
            <li>Process multi-level expansion</li>
            <li>Process implication</li>
        </ul>
    </div>);
}