export default function PlaceClause() {
    return (
        <div>
            <p>Alright, looks like placing the known terms is being a little finnicky. I&apos;ve learned so far to keep the following in mind:</p>
            <div className="pl-8">
                <p>Keeping track of lists of instances is too hard considering you&apos;d have to pass a copy of the instance, but you don&apos;t want a new instance until all terms have been placed.</p>
                <p>So let&apos;s settle on returning a list of lists in which each inner list is the list of clauses (with all the terms placed) for that instance.</p>
                <p>Then you can iterate that list and copy the instance and update the clauses with the same ids.</p>
                <p>Cool.</p>
                <p>Now, implementation time.</p>
                <p>For clause in instance.clauses</p>
                <div className="pl-8">
                    <p>helper(clause, terms)</p>
                </div>
                <p># return list of clauses with every possible term placement</p>
                <p>helper(clause, terms):</p>
                <div className="pl-8">
                    <p>if len(terms) == 0: return [clause]</p>
                    <p>ans = []</p>
                    <p>for term in terms:</p>
                    <div className="pl-8">
                        <p>c = clause.copy()</p>
                        <p>for unk in c.unknown(filter where there&apos;s room):</p>
                        <div className="pl-8">
                            <p>unk.known.add(term)</p>
                            <p>rest = helper(c, terms(filter out term))</p>
                            <p>ans.extend(rest)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}