export default function August7() {
    return (<div>
        <p>Success! Processing clauses now works. Given an instance complete with implications and connections, you can place the opposite form terms and a new instance will be created for every possibility of placement in the different sets of terms in the clauses.</p>
        <p>Next, for each instance (without floaters), need to know the shortest possibility of the longest clause that must be processed.</p>
        <p>For instance, we know a clause after an implication is just the union of the two input clauses subtracting the opposite form terms. Now if we can derive a subset of this clause, then we may be able to skip a clause of a certain length.</p>
        <p>What are some rules to keep in mind?</p>
        <div className="pl-8">
            <p>If a clause contains a subset of the terms in another clause, the first clause can expand to the other clause.</p>
            <p>But how would you measure subsets?</p>
            <p>Say A := [&alpha;], B := [&beta;], C := [&alpha; U &delta;], D := [&beta; U &zeta;], E := [&nu;]</p>
            <p>Say a and -a are the opposite form terms in C and D</p>
            <p>We know &nu; === &alpha; U &delta; U &beta; U &zeta; - a - -a</p>
            <p>So if we happen to know a &isin; &delta;, and there&apos;s no overlap between &delta; and &alpha;, then we know a (and similarly -a) is not in &alpha;, we know &alpha; is a subset of &nu; and we can derive E without processing a clause whose length exceeds that of E.</p>
        </div>
        <p>--- August 8th ---</p>
        <p>So what&apos;s the plan? Perhaps a way to represent the output clause with unknowns, knowns, and negations. Then we could make a function to determine whether a clause can expand to another clause based on these.</p>
        <p>In fact, since we know the instance is fully processed (no floaters exist), if we have an unknown termset that does not have a known term, we can be certain that unknown termset does not have that known term. This may require additional thinking to prove, but hear me out: If I have the clause A which contains the unknown termsets &alpha; and &delta; and I know &delta; contains the term a, I know &alpha; does not contain the term a simply because a has already been placed and it has not been placed in &alpha;. This may require additional thought as a term could exist in two other termsets, but hmmm, I&apos;m not sure. I&apos;ll implement it and then see. </p>
        <p>Now it becomes rather easy I want to say. If I have the final clause which contains &alpha;, &delta;, &beta;, and &zeta; and does not contain a or -a, I can say for certain (pending the last paragraph turns out to be correct) that if I have a clause that contains one of the aforementioned termsets and does not contain the known term a or -a, then it can expand to that final clause and the largest clause that needs to be processed is the length of the final clause.</p>
        <p>Next steps:</p>
        <p className="pl-8">Add a field to Clause to represent the terms that do not exist in the clause (for example, &alpha; may contain i and A may contain &alpha; except for i)</p>
        <p className="pl-8">Add some logic to addOpposites() that replaces the output&apos;s unknown with the union of the inputs&apos; unknowns as well as carries over any terms that are not in the clause</p>
        <p className="pl-8">add the function clause.canExpand(other: Clause) to return whether the current clause can expand to the other clause.</p>
    </div>);
}