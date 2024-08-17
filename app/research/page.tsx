import Preview from "./preview";

export default function Research() {

    const papers = [
        {
            name: "A Refutation of Popular Diagonalization Applications",
            abstract: `This paper analyzes the use of diagonalization as applied by Georg
Cantor and Alan Turing and shows how their claims do not logically
follow from their respective proofs. In Cantor's work, diagonalization
and contradiction are used to prove the set of infinite binary sequences
does “not have the power of the number-sequence 1, 2, 3, ..., v, ...”
i.e., the set is not enumerable. In Turing's work, the diagonal process
and contradiction are used to prove the computable sequences are not
enumerable. Both proofs incorrectly use contradiction, due to the
fact that they assume the truth of two statements and recognize only
one. Namely, they assume (1) the set in question is enumerable and
(2) the proposed sequence is possible. It is seen that neither proof
can concretely and definitively disprove the first assumption as they
heavily rely on the second assumption.`,
            date: "July 2024",
            url: "/research/refutationpaper"
        },
        {
            name: "A Polynomial Time Algorithm for 3SAT",
            abstract: `It is shown that any two clauses in an instance of 3SAT sharing the same terminal which is positive in one clause and
negated in the other can imply a new clause composed of the remaining terms from both clauses. Clauses can also
imply other clauses as long as all the terms in the implying clauses exist in the implied clause. It is shown an instance
of 3SAT is unsatisfiable if and only if it can derive contradicting 1-terminal clauses in exponential time. It is further
shown that these contradicting clauses can be implied with the aforementioned techniques without processing clauses
of length 4 or greater, reducing the computation to polynomial time. Therefore there is a polynomial time algorithm
that will produce contradicting 1-terminal clauses if and only if the instance of 3SAT is unsatisfiable. Since such an
algorithm exists and 3SAT is NP-Complete, we can conclude P = NP.`,
            date: "January 2024 - August 2024",
            url: "/research/3satpaper"
        },
        {
            name: "Presentation - A Polynomial Time Algorithm for 3SAT",
            abstract: `A visual explanation of the polynomial time algorithm for 3SAT.`,
            date: "January 2024",
            url: "/research/3satpresentation"
        }
    ]

    return (
        <div className="">
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">Research</h1>
                <p className="text-xl">Papers I&apos;ve written</p>
                <p className="text-xl">Click on any section to read to the paper</p>
            </div>
            {papers.map((paper, i) =>
                <div key={i} className="my-8">
                    <Preview
                        props={paper}
                    />
                </div>
            )}
            <div className="h-[20vh]"></div>
        </div>
    );
}