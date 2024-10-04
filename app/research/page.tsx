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
            abstract: `This paper presents a polynomial time algorithm for 3SAT using the idea of Implication which allows for the derivation of contradicting 1-terminal clauses iff the instance is unsatisfiable. The idea is that any two clauses which contain the same terminal which is positive in one clause and negated in the other can imply a new clause which consists of all the terms in either clause except for the opposite form terms. Two 1-terminal clauses which contain opposite form terms are called contradicting 1-terminal clauses and their existence implies the instance is unsatisfiable.`,
            date: "January 2024 - October 2024",
            url: "/research/3satpaper"
        },
        {
            name: "Presentation - A Polynomial Time Algorithm for 3SAT",
            abstract: `A visual explanation of the polynomial time algorithm for 3SAT.`,
            date: "January 2024",
            url: "/research/3satpresentation"
        },
        {
            name: "24 Sep 2024 3SAT Outline",
            abstract: "Outline to fix the proof",
            date: "Sep 2024",
            url: "/research/3satproofoutline"
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