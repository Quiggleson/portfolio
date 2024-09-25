import Image from "next/image";
import igraph from '../../public/igraph.png';

export default function Sep16() {
    return (
    <div>
        <p>This will refer to the following implication graph:</p>
        <Image 
            src={igraph}
            height={600}
            alt="Picture of implication graph"
            sizes="(max-width: 768px) 100vw, 33vw"
        />
        <p className="font-bold text-xl">Idea</p>
        <p>What we&apos;re aiming for here is along the lines of the following:</p>
        <p>1. I have the implication graph in which the 3-t expands to n-t then each n-t reduces down to 3-t then 2-t then contradicting 1-t clauses</p>
        <p>2. I can shortcut the n-1 to n to n-1 step and derive the n-1-t clauses without processing an n-t clause</p>
        <p>2a. This produces a new graph in which n-2 expands to n-1 and n-1 implies n-1 then the second n-1 reduces to n-2</p>
        <p>2b. It is shown that processing an n-1-t clause in this graph is required.</p>
        <p>2c. However, if we started at n-3 and ended at n-3, we gain more information</p>
        <p>3. (Ideally we&apos;d like to show) we can shortcut this n-3 graph to derive the n-3 terms we need without processing an n-1-t clause</p>
        <div className="pl-8 outline w-fit pr-2 rounded">
            <p>I just had an idea- what if we don&apos;t have to even look at an intermediate graph, but instead only deal with the imp graph up to n</p>
            <p>Hear me out: First we have n-1 to n to n-1 and we show we can skip n</p>
            <p>Then we have n-2 to n to n-2 and we show we can skip XX</p>
            <p>Then we have n-3 to n to n-3 and we show we can skip YY</p>
            <p>... Then we have 3 to n to 3 and we show we can skip ZZ</p>
            <p>However, it was shown that we need to process at least a 4-t clause to get all the 3-t clauses. How will this affect the plan?</p>
            <p>Consider the plan as it pertains to n-2:</p>
            <p>n-2 expands to n-1 expands to n implies n-1 implies n-2</p>
        </div>
        <p></p>
        <p>Page 1</p>
        <p></p>
    </div>
    );
}