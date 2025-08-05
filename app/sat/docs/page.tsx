import clauseClosed from '@/public/satdocs/clause_closed.png'
import ClauseOpen from '@/public/satdocs/clause_open.png'
import WorkflowOnePreview from '@/public/satdocs/workflow_one_preview.png'
import OutputWF1 from '@/public/satdocs/output_wf1.png'
import ExpansionPreview from '@/public/satdocs/expansion_preview.png'
import ExpansionButton from '@/public/satdocs/expansion_button.png'
import CompletedExpansion from '@/public/satdocs/completed_expansion.png'
import ImplicationPreview from '@/public/satdocs/implication_preview.png'
import ImplicationButton from '@/public/satdocs/implication_button.png'
import CompletedImplication from '@/public/satdocs/implication_completed.png'

import { Lekton } from 'next/font/google'

import Image from 'next/image'

const lekton = Lekton({ weight: '700', subsets: ['latin'] });

const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

export default function docs() {


    return (
        <div className='flex justify-between overflow-y-scroll h-full'>
            <div className='sticky top-0 ml-4 mt-2'>
                <div>Page Navigation</div>
                <div>
                    <a href='#From3SAT' className='hover:underline'>From 3SAT</a>
                    <div className='pl-2'>
                        <p><a href='#VocabAndSyntax' className='hover:underline'>Vocab and Syntax</a></p>
                        <p><a href='#Ideas' className='hover:underline'>Ideas</a></p>
                    </div>
                </div>
                <div>
                    <a href='#ThisTool' className='hover:underline'>This Tool</a>
                    <div className='pl-2'>
                        <p><a href='#Clauses' className='hover:underline'>Clauses</a></p>
                        <p><a href='#Expansions' className='hover:underline'>Expansions</a></p>
                        <p><a href='#Implications' className='hover:underline'>Implications</a></p>
                    </div>
                </div>
                <div>
                    <a href='#Workflow' className='hover:underline'>Example Workflow</a>
                </div>
            </div>
            <div className="w-[50vw] ml-2">

                <h1 className="text-2xl" id="From3SAT">From 3SAT</h1>
                <div>
                    <p>First up, let&apos;s get the general information outta the way:</p>
                    3SAT is a form of the <a target="_blank" href="https://en.wikipedia.org/wiki/Boolean_satisfiability_problem" className="text-blue-600 underline">boolean satisfiability problem</a>.
                    In 3SAT, we are given the following:
                    <ol>
                        <li className={lekton.className}>1. n literals, x_1, x_2, ..., x_n</li>
                        <li className={lekton.className}>2. a set of clauses, where each clause is of the form (x_i ∨ x_j ∨ x_k) where x_i, x_j, x_k are either positive or negative literals </li>
                    </ol>
                    <p>These three literals are combined by logical <span className={lekton.className}>OR</span> operators within the clause.</p>
                    <p>Meanwhile each clause is combined by logical <span className={lekton.className}>AND</span> operators.</p>
                    <p>The problem of 3SAT is to determine if there exists an assignment for each of these literals, true or false, such that the instance evaluates to true.</p>
                </div>

                <h2 className='text-2xl mt-4' id="VocabAndSyntax">Vocab and Syntax</h2>
                <div>
                    <p><span className={lekton.className}>Terminal</span> - refers to the literal in a clause whose value can be assigned True or False</p>
                    <p><span className={lekton.className}>Term</span> - refers to the positive or negative terminal placed in a clause</p>
                    <p className='pl-2'>Terms are written as one or more lowercase letters. They are prefixed by a minus sign to indicate they are negative. Optionally, they are prefixed by a plus sign to indicate they are positive.</p>
                    <p className='pl-2'>For example, <span className={lekton.className}>-a</span> is a negative term and <span className={lekton.className}>a</span> is a positive term.</p>
                    <p><span className={lekton.className}>Term Set</span> - refers to a set of terms if we do not yet know the exact terms in the set.</p>
                    <p className='pl-2'>Term Sets are named with the form <span className={lekton.className}>{'{id}_{length}'}</span> where id is one or more lowercase letters.</p>
                    <p><span className={lekton.className}>Opposite Form Terms</span> - refer to two terms of the same terminal in which one term is positive and one term is negative</p>
                    <p><span className={lekton.className}>Clauses</span> will be represented as <span className={lekton.className}>[a, b, c]</span> where <span className={lekton.className}>a, b, </span> and <span className={lekton.className}>c</span> are terms</p>
                    <p className='pl-2'>Clauses are named with one or more capitalized letters.</p>
                </div>

                <h2 className='text-2xl mt-4' id="Ideas">Ideas</h2>

                <h2 className='text-xl mt-4'>The Goal</h2>
                <div>
                    <p>The goal of 3SAT comes down to decoding the given information in such a way as to return whether the instance is satisfiable. It would be really cool if this could be done in polynomial time. </p>
                    <p className='mt-4'>{"One idea here is that the existence of some clauses can imply the existence of other clauses. By \"imply\" I mean these implied clauses can be introduced to the instance without changing whether it's satisfiable."}</p>
                    <p className='mt-4'>I will discuss two ways to imply a new clause: via the methods of Expansion and Implication</p>
                </div>

                <h2 className='text-xl mt-4'>Expansion</h2>
                <div>
                    <p>Using the method of Expansion, we can imply a new clause as follows.</p>
                    <p className={lekton.className}>A expands to B if all the terms in A exist in B</p>
                    <p>For example, define the clauses as follows:</p>
                    <ul className={lekton.className}>
                        <li>A := [a, b, c]</li>
                        <li>B := [a, b, c, d]</li>
                    </ul>
                    <p>Notice all of the terms in <span className={lekton.className}>A</span> exist in <span className={lekton.className}>B</span> so we can add <span className={lekton.className}>B</span> to the instance without changing the satisfiability.</p>
                    <p>In general, this is the only requirement for an Expansion, but in this tool we have the further requirement that the output clause must have a exactly one term more than the input clause (this is just so we can have a clear trace of the clauses in the path).</p>
                </div>

                <h2 className='text-xl mt-4'>Implication</h2>
                <div>
                    <p>Using the idea of Implication, we can imply a new clause as follows:</p>
                    <p className={lekton.className}>A and B imply C if there exists a term in A whose negation exists in B and C solely consists of all the remaining terms in A and B.</p>
                    <p>For example, define the clauses as follows:</p>
                    <ul className={lekton.className}>
                        <li>A := [a, b, c]</li>
                        <li>B := [-a, d, e]</li>
                        <li>C := [b, c, d, e]</li>
                    </ul>
                    <p>Notice the opposite form of the term <span className={lekton.className}>a</span> exists in <span className={lekton.className}>B</span> and all of the terms in <span className={lekton.className}>C</span> come from the remaining terms in <span className={lekton.className}>A</span> and <span className={lekton.className}>B.</span></p>
                </div>

                <div className='mt-4'>If it turns out that we can use these methods to derive two clauses, <span className={lekton.className}>[a]</span> and <span className={lekton.className}>[-a]</span> iff the instance is unsatisfiable, for at least one literal, without exceeding clauses of a fixed length, then P = NP. And that would be pretty cool.</div>
                <div>For a proof that these implications do not change the satisfiability of the instance and for further thoughts on this idea, read the Exploration of Ideas section of <a className="text-blue-600 underline" target="_blank" href="/research/3satpaper">This paper</a></div>

                <h1 className="text-2xl mt-4" id="ThisTool">This Tool</h1>
                <div>
                    <p>This tool is used to analyze information about a generic set of Expansions and Implications.</p>
                    <p>Given certain Expansions and Implications, sometimes different Expansions and Implications exist and the output clause can be derived through a different path of clauses. For example, see <a href="#Workflow" className='text-blue-600 underline'>the workflow</a> below</p>
                    <p>In mathematical proofs, it is useful to be able to automatically analyze an instance like this and quickly learn alternate routes for implying new clauses.</p>
                </div>

                <h1 className="text-2xl mt-4" id="Clauses">Clauses</h1>
                <div>This is a clause</div>
                <Image src={clauseClosed} alt="An image of a clause with name A, length 3, and four fields: Term Sets, Known, Placed, and Excluded"
                />
                <p>There are four fields to clause:</p>
                <ol className='pl-2'>
                    <li>Term Sets</li>
                    <li>Known</li>
                    <li>Placed</li>
                    <li>Excluded</li>
                </ol>
                <h3 className='text-xl mt-4'>Term Sets</h3>
                <div>
                    <p>These are sets of terms that exist in this clause. If we have some information like <span className={lekton.className}>Term +a exists in Term Set a_3</span>, then that information applies to all clauses which have the Term Set <span className={lekton.className}>a_3</span></p>
                </div>
                <h3 className='text-xl mt-4'>Known</h3>
                <div>
                    <p>This is a set of terms we know exist in this clause.</p>
                    <p>For example, we know terms exist in a clause if that clause is part of an implication.</p>
                    <p>Note that we may not know which Term Set the term exists in, we just know it is in at least one of them.</p>
                </div>
                <h3 className='text-xl mt-4'>Placed</h3>
                <div>
                    <p>This is a set of terms which have been placed in Term Sets.</p>
                    <p>This is a subset of Known.</p>
                    <p>Terms are manually placed in Term Sets.</p>
                </div>
                <h3 className='text-xl mt-4'>Excluded</h3>
                <div>
                    <p>This is a set of terms which we know this clause cannot contain.</p>
                    <p>For example, if a clause is an output of an Implication, the opposite form term from the inputs cannot exist in either form in this clause.</p>
                </div>
                <p>Below is an example clause with Term Sets <span className={lekton.className}>a_3</span> and <span className={lekton.className}>d_1</span>, one known Term, <span className={lekton.className}>+a</span>, and one placed term, <span className={lekton.className}>+a</span> in Term Set <span className={lekton.className}>a_3</span></p>
                <Image src={ClauseOpen} alt="An image of a clause with its fields expanded. In the Term Set field are two Term Sets: a_3 of length 3 and d_1 of length 1. In the known field is one term: positive a. In the placed field is one term: positive a is in Term Set a_3. There are no items in the excluded field." />

                <h1 className="text-2xl mt-4" id="Expansions">Expansions</h1>
                <div>
                    <p>This is an Expansion</p>
                    <Image src={ExpansionPreview} alt="An image of two clauses, A and B, with a line between them." />
                    <p>Expansions are drawn as a line connecting two clauses.</p>
                    <p>To add an Expansion, click the Add Expansion button in the left side bar. This will put you in &quot;Add Expansion Mode&quot;</p>
                    <p>In this mode, you will see instructions to finish adding the Expansion as well as the partially completed Expansion. This is shown below.</p>
                    <Image src={ExpansionButton} alt="An image of a section heading titled 'Expansions', a button titled 'Add Expansion'. Text saying 'Click on the headers of two clauses to complete the connection', and text saying 'A expands to _'" />
                    <p>Once the Expansion is completed, it will exist as a line between two clauses as well as text in the left side bar.</p>
                    <Image src={CompletedExpansion} alt="An image of a section heading titled 'Expansions', a button titled 'Add Expansion', and text with an arrow from the letter A to the letter B with a trash icon and an eye icon to the right of it." />
                    <p>Here you can delete or hide the Expansion.</p>
                </div>

                <h1 className="text-2xl mt-4" id="Implications">Implications</h1>
                <div>
                    <p>This is an Implication</p>
                    <Image src={ImplicationPreview} alt="An image of three clauses, A, B, and C, with lines from A to C and B to C." />
                    <p>Implications are drawn as two lines coming from the input clauses to the output clause.</p>
                    <p>To add an Implication, click the Add Implication button in the left side bar. This will put you in &quot;Add Implication Mode&quot;</p>
                    <p>In this mode, you will see instructions to finish adding the Implication as well as the partially completed Implication. This is shown below.</p>
                    <Image src={ImplicationButton} alt="An image of a section heading titled 'Implications', a button titled 'Add Implication'. Text saying 'Click on the headers of input 1, input 2, then output to complete the implication', and text saying 'A, _ implies _'" />
                    <p>Once the Implication is completed, it will exist as a lines connecting the input clauses to the output clause as well as text in the left side bar.</p>
                    <Image src={CompletedImplication} alt="An image of a section heading titled 'Implications', a button titled 'Add Implication'. Text saying 'Click on the headers of input 1, input 2, then output to complete the implication', and text 'A, B, right arrow, C' with a trash icon and an eye icon to the right of it." />
                    <p>Here you can delete or hide the Implication.</p>
                </div>

                <h1 className='text-2xl mt-4' id="Workflow">Example Workflow - Two Expansions into an Implication</h1>
                <div>
                    <p>This section explains how to use this tool in the following instance:</p>
                    <Image src={WorkflowOnePreview} alt="An image of an instance of five clauses, A, B, C, D, and E with a line drawn from A to D, a line from B to C, and lines from D and C to E." />
                    <p>Where <span className={lekton.className}>A, B, C, D, </span> and <span className={lekton.className}>E</span> are clauses,</p>
                    <p><span className={lekton.className}>A</span> expands to <span className={lekton.className}>D</span>,</p>
                    <p><span className={lekton.className}>B</span> expands to <span className={lekton.className}>C</span>, and</p>
                    <p><span className={lekton.className}>C</span> and <span className={lekton.className}>D</span> imply <span className={lekton.className}>E</span>.</p>
                </div>
                <h2 className='text-lg mt-4'>1. Add the Clauses</h2>
                <div>
                    <p>Add five clauses to the instance by clicking the Add Clause button in the left sidebar. Click and drag the clauses to see them better.</p>
                    <video
                        src={basePath + "/satdocs/add_five_clauses.webm"}
                        controls
                        className='my-4'
                    />
                </div>
                <h2 className='text-lg mt-4'>2. Add the Expansions</h2>
                <div>
                    <p>Enter &quot;Add Expansion Mode&quot; by clicking the Add Expansion button in the left sidebar.</p>
                    <p>Click the header of the input clause then the header of the output clause to add the expansion.</p>
                    <p>You will see the status of the partially completed expansion in the left sidebar</p>
                    <video
                        src={basePath + "/satdocs/add_expansions_wf1.webm"}
                        controls
                        className='my-4'
                    />
                </div>
                <h2 className='text-lg mt-4'>3. Add the Implication</h2>
                <div>
                    <p>Enter &quot;Add Implication Mode&quot; by clicking the Add Implication button in the left sidebar.</p>
                    <p>Click the headers of the two input clauses then the header of the output clause to add the implication.</p>
                    <p>You will see the status of the partially completed implication in the left sidebar</p>
                    <video
                        src={basePath + "/satdocs/add_implication_wf1.webm"}
                        controls
                        className='my-4'
                    />
                </div>
                <h2 className='text-lg mt-4'>4. Update the Length</h2>
                <div>
                    <p>Update the length of clause <span className={lekton.className}>C</span> and <span className={lekton.className}>D</span>.</p>
                    <p>Open the Clause Modal by clicking the pencil icon in the left side bar.</p>
                    <p>Once the modal is open, change the length of the clause and click Submit.</p>
                    <video
                        src={basePath + "/satdocs/update_len_wf1.webm"}
                        controls
                        className='my-4'
                    />
                </div>
                <h2 className='text-lg mt-4'>5. Add the Implied Terms and Term Sets</h2>
                <div>
                    <p>Now that the clauses, Expansions, and Implications are added to the instance, we can add implied terms and Term Sets.</p>
                    <p>Notice that <span className={lekton.className}>A</span> and <span className={lekton.className}>B</span> are not outputs of any Expansion or Implication, so we can say the terms in <span className={lekton.className}>A</span> are in the Term Set <span className={lekton.className}>a_3</span> and the terms in <span className={lekton.className}>B</span> are in the Term Set <span className={lekton.className}>b_3.</span></p>
                    <p>The fact that <span className={lekton.className}>A</span> expands to <span className={lekton.className}>D</span> means there must be some term in <span className={lekton.className}>D</span> that does not exist in <span className={lekton.className}>A</span>. Call this Term Set <span className={lekton.className}>d_1</span>.</p>
                    <p>Similarly, we know a Term Set, <span className={lekton.className}>c_1</span>, exists in <span className={lekton.className}>C</span>.</p>
                    <p>Notice that in order for the Implication from <span className={lekton.className}>C</span> and <span className={lekton.className}>D</span> to <span className={lekton.className}>E</span> to exist, there must be an opposite form term in <span className={lekton.className}>C</span> and <span className={lekton.className}>D</span> and those terms cannot exist in <span className={lekton.className}>E</span>. Say <span className={lekton.className}>+a</span> is known in <span className={lekton.className}>D</span> and <span className={lekton.className}>-a</span> is known in <span className={lekton.className}>C</span> and both are excluded from <span className={lekton.className}>E</span>.</p>
                    <p className='mt-4'>Click the Add Implied Terms and Term Sets button to add all the above data to the instance.</p>
                    <video
                        src={basePath + "/satdocs/add_implied_terms_wf1.webm"}
                        controls
                        className='my-4'
                    />
                </div>
                <h2 className='text-lg mt-4'>5. Place Terms</h2>
                <div>
                    <p>At this point we know <span className={lekton.className}>+a</span> exists in <span className={lekton.className}>D</span>, but we don&apos;t know which Term Set in <span className={lekton.className}>D</span> that <span className={lekton.className}>+a</span> exists in. Similarly for <span className={lekton.className}>-a</span> and <span className={lekton.className}>C</span>.</p>
                    <p>The next step is to place the terms in Term Sets.</p>
                    <p>Open the Place Terms modal by clicking the Place Terms button in the left sidebar.</p>
                    <p>For each term, this lists the available Term Sets in which that term could be placed.</p>
                    <p>Place the term <span className={lekton.className}>+a</span> in Term Set <span className={lekton.className}>a_3</span></p>
                    <p>and the term <span className={lekton.className}>-a</span> in Term Set <span className={lekton.className}>b_3</span></p>
                    <p>then click Submit.</p>
                    <p>Optionally, you can hide clauses by clicking the eye icon in the left side bar.</p>
                    <p className='mt-4'>Now we have more information about the instance:</p>
                    <p>1. Because clauses <span className={lekton.className}>A</span> and <span className={lekton.className}>B</span> now contain an opposite form term, we can imply a new clause, <span className={lekton.className}>G</span>, which contains the Term Sets from <span className={lekton.className}>A</span> and <span className={lekton.className}>B</span> while excluding the opposite form terms.</p>
                    <p>2. Similarly, we can add the following Implications:</p>
                    <p className={'pl-2'}><span className={lekton.className}>A, C imply F</span></p>
                    <p className={'pl-2'}><span className={lekton.className}>B, D imply H</span></p>
                    <p>3. Because <span className={lekton.className}>E</span> contains all the Term Sets in <span className={lekton.className}>F</span> and they both exclude the same terms, we can add an expansion from <span className={lekton.className}>F</span> to <span className={lekton.className}>E</span></p>
                    <p>4. Similarly, we can add the following Expansions:</p>
                    <p className={'pl-2'}><span className={lekton.className}>H expands to E</span></p>
                    <p className={'pl-2'}><span className={lekton.className}>G expands to H</span></p>
                    <p className={'pl-2'}><span className={lekton.className}>G expands to F</span></p>

                    <video
                        src={basePath + "/satdocs/place_terms_wf1.webm"}
                        controls
                        className='my-4'
                    />
                </div>
                <h2 className='text-lg mt-4'>6. Examine Output</h2>
                <div>
                    <p>Now that we&apos;ve added new clauses to the instance, we can analyze the new information about the clause.</p>
                    <p>Notice we no longer have to go through the two clauses, <span className={lekton.className}>C</span> or <span className={lekton.className}>D</span> to derive the output clause, <span className={lekton.className}>E.</span></p>
                    <p>With further processing, the lengths of the clauses in the path can be proven to have an upper bound. In this particular instance, it can be shown that <span className={lekton.className}>E</span> can always be derived without processing a clause of length 4 or greater.</p>
                    <Image src={OutputWF1} alt="An image of an instance with clauses, A, B, G, H, F, and E, in which A and B imply G, G expands to H, G expands to F, H expands to E, and F expands to E." />
                </div>
                <div className='h-40'></div>
            </div>
            <div></div>
        </div>
    )
}