import aug30 from '../../public/aug30.json';
import { downloadJSON } from '../utils/download';

export default function August30() {
    return (
    <div>
        <div>Click <button className="rounded outline outline-2 px-1 hover:bg-button-hover" onClick={() => downloadJSON('instance.json', aug30)}>here</button> to download the latest example (expand from 3 to 5 then imply to 5 then imply to 4 then imply to 3)</div>
        <p>Things are working pretty alright now, but they are very very slow and not super robust</p>
        <p>Slow: Checking the longest clause to derive another clause is very slow</p>
        <p>Not robust: Checking the clauses to place the known terms relies on questionable decisions</p>
        <p>New plan:</p>
        <p>1. Some way to set the output clause</p>
        <div className="pl-8">
            <p>Find the clause with the highest column (relies on user setting the output clause to the highest column and could get finnicky with multiple clauses in that column)</p>
            <p>The user sets it (and it will likely stay highlighted to indicate this)</p>
            <p>Maybe allow the user to set it, but if no output clause is selected, it selects the first clause in the final column</p>
        </div>
        <p>2. Starting with the output clause, keep tracing the inputs of implications until you come across an expansion. The output of the first expansion you come across (searching right to left from the final output) will contain all of the terms needed to derive AE (with the help of other clauses)</p>
        <div className="pl-8">
            <p>This used to be one of the first thoughts when analyzing one of these problems- find the column which contains all of the terms needed</p>
            <p>But now that I think about it, it doesn&apos;t feel like there&apos;s anything particularly special about these.</p>
            <p>This used to be especially important when all of the implications outputted a clause shorter than the inputs, but now it&apos;s feeling less important</p>
            <p>Perhaps each implication and the placement of the opposite form terms can be handled individually without having to trace it back</p>
            <p>Let A, B, C, and D be of length n - 1 and E, F be of length n - 1 and G be of length n - 2</p>
            <p>A + B implies E</p>
            <p>C + D implies F</p>
            <p>E + F implies G</p>
            <p>Here G is the final output clause and we know (since G is shorter than E and F) that the terms in E minus a and the terms in F minus -a are equal to each other as well as the terms in G</p>
            <p>Each clause in the graph is made up of 1. opposite form terms and 2. terms that exist in the final output - nothing else.</p>
            <p>Perhaps something can be said about the n - 1 implies another n - 1 step.</p>
            <p>If you follow one clause from the initial n - 3 to the final output n - 3, it will expand to n - 2 then expand to n - 1 then imply n - 1 then imply n - 2 then imply n - 3. </p>
            <p>At the second n - 1, it will have all of the terms necessary to derive the final output (with the help of other clauses to pop the opposite form terms).</p>
            <p>With each implication, this requires one opposite form term (well two more, one in the positive clause and one in the negative clause)</p>
            <p>If we trace that same n-3-t clause, we know that at the first n-1, it had the opposite form term to imply the second n-1 and at the second n-1, it had two more opposite form terms to imply n-2 then n-3.</p>
            <p>However, we do not know the placement of these terms at the first n-1 since the output of this implication is not shorter than the inputs.</p>
            <p>Since two n-1-t clauses implied another of the same length, we know the clauses were identical except for 1. the opposite form term and 2. both clauses had one term that did not exist in the other</p>
            <p>For example, it could have been like (a, b, c, e) and (b, c, d, -e) implies (a, b, c, d)</p>
            <p>Notice, too, that the output n-1-t clause had all of the terms in final output clause.</p>
            <p>We know the second n-1-t clause contains two opposite form terms.</p>
            <p>They were either 1. both in one clause (and one copied in the other) or 2. both clauses had just one or 3. both in both</p>
            <p>Say e and f are the opposite form terms, then we have the two cases:</p>
            <p>1. (a, b, e, f, g) and (a, b, c, e, -g) implies (a, b, c, e, f)</p>
            <p>2. (a, b, c, e, g) and (a, b, c, f, -g) implies (a, b, c, e, f)</p>
            <p>3, (a, b, e, f, g) and (b, c, e, f, -g) implies (a, b, c, e, f)</p>
        </div>
    </div>
    );
}