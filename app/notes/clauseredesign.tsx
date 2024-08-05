export default function ClauseRedesign() {
    return (
        <div>
            <p>Alright, clauses will be a tad more complicated with the introduction of sets of terms as opposed to tangible terms</p>
            <p>We can have clauses like [&alpha;] and [&alpha;, a, b, c]. And <em>maybe</em> down the line we can have [&alpha; U &beta; - {"{i, -i}"}]. Idk that&apos;s a stretch goal, for now we focus on now.</p>
            <p>Clauses, right? You know &apos;em, you love &apos;em! But have you ever wondered about them?</p>
            <p>Dang, sorry I feel like I&apos;m fueled by a lack of caffeine right now. </p>
            <p>Clauses. Terms. Names. Alright, what do we know?</p>
            <p>A clause contains term</p>
            <p>In the initial construction, we&apos;re not sure what terms exactly, but we can have a vague sense of length</p>
            <p>Let&apos;s say then that a clause contains a set of terms and we&apos;ll denote this with a greek letter. Eh we should probably switch the naming convention. Alright say capital letters surrounded by parentheses.</p>
            <p>So we have a bunch of clauses, A = [(A)], B = [(B)], C = [(C)]. Cool, fine, and dandy.</p>
            <p>But what if I want to add another term? Let&apos;s denote single terms by lowercase letters</p>
            <p>So AA = [(A), a], AAA = [(A), a, aa], which means:</p>
            <p>A clause, AA, containing a set of terms, (A), and a term, a</p>
            <p>A clause, AAA, containing a set of terms, (A), a term, a, and a term, aa</p>
            <p>Lotta a&apos;s in there for an example, but hopefully you get the point.</p>
            <p>Cool, now we have a list. A list of what, though? Maybe have one class for term set and another for a single term. Or just add a flag to treat the single term differently. Although it&apos;s not too different.</p>
            <p>Recall the use case will be something along the lines of &quot;I know the clause AAA contains the term i and there are three different places it could be: (A), a, or, aa&quot;</p>
            <p>So there&apos;s really no need to differentiate single terms as of yet.</p>
            <p>Dang, this feels silly to make it a class, but we do need to know the length of the term set.</p>
            <p>---</p>
            <p>Alright, just to make sure everything&apos;s set:</p>
            <p>Clauses remain the same except knownTerms becomes a set of terms... hmmmm want a good name for an object that can be a list of terms. Not sure about a one word name, so let&apos;s go with TermSet.</p>
            <p>And the TermSet class has id, name, length, and knownTerms. knownTerms is another set of TermSet objects.</p>
            <p>I think I&apos;ll make a v2 of the sat page so the tangible terms and that whole system can still exist</p>
        </div>
    );
}