'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const PDFViewer = dynamic(() => import('../pdfviewer'), { ssr: false });

export default function RefutationPaper() {

    const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

    const [exp, setexp] = useState(false)

    return (
        <div>
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">3SAT 24 Sep 2024 Outline</h1>
                <a href={`${basePath ? basePath : ''}/sep20proofoutline.pdf`} target="_blank" className="outline text-xl rounded hover:bg-bg-light px-2">Download PDF</a>

                <div>
                    <p className='text-2xl'>Preliminary</p>
                    <p>Two clauses, [a, b, c] and [d, e, -c] are said to imply another clause, [a, b, d, e] due to the fact that c exists as positive in one clause and negated in the other.</p>
                    <p>We can add [a, b, d, e] to the instance without blocking any additional assignments</p>
                    <p>In the above example, c may be referred to as the popped term or the opposite form term (OFT)</p>
                    <p>Long story short (proof coming later), the following clauses can always be derived by processing clauses as mentioned above: [a, b], [a, -b], [-a, b], [-a, -b] for some two terminals a and b</p>
                    <p>However, you may have to keep making a clause bigger and bigger, potentially linear wrt the number of terminals. In other words, it is too slow.</p>
                    <p className='text-2xl'>Explanation</p>
                    <p>But now this shows you only have to process clauses of up to length 4 to derive the aforementioned four clauses!!</p>
                    <p>The first page shows an example list of clauses processed. You can see each new 3-terminal clause has a negative term that is used to pop a positive term from the running clause.</p>
                    <p>The running clause is the large clause on the right side of the page. I did not write it out on every line, but you can easily see the pattern among the first 3 lines and that middle section.</p>
                    <p>Below [-j, a, b] nothing important is written.</p>
                    <p>Page 2 is just some brainstorming. Largely unimportant.</p>
                    <p>Page 3 - I really do not remember. Probably unimportant.</p>
                    <p>Page 4 - Conversational brainstorming. OFT stands for opposite form term. It means the term that is popped.</p>
                    <p>Page 5 - Traced the example (see my other gh repo called sat for the code for this. It is very much not intended to be intuitive to others, sorry I was preoccupied) from Page 1.</p>
                    <p>It starts from the target and each clause has lines indicating the children which are the two input clauses to derive that clause.</p>
                    <p>If there is a dot to the top left of a clause, it is a given clause.</p>
                    <p>Page 6 is the graph and mostly rubbish observations</p>
                    <p>Page 7 - holy crap this is it! Starting at the middle of the page.</p>
                    <p>In summary, for every term, i, that is popped, we can obtain the clause [a, b, -i]. We then find a clause like [i, x, y] where i, x, and y are all terms to be popped. And since we have [a, b, -i], [a, b, -x], and [a, b, -y], we can derive [a, b, x, y] then [a, b, x] then [a, b]</p>
                    <p>Resulting in being able to derive the final output 2-terminal clause, [a, b] without processing a clause greater than length 4!!!!!</p>
                    <p>It brings me quite a bit of joy to finally have figured this out.</p>
                    <button onClick={() => setexp(!exp)} className="outline rounded px-2 hover:bg-bg-light">Show/Hide Late Night Rambling Letter</button>
                    {exp && <div>
                        <p className='text-2xl'>Late Night Rambling (sorry, it&apos;s late)</p>
                        <p>I know probably no one will read this, but I&apos;m going to type it anyway.</p>
                        <p>I wrote the first draft of the paper in January. It felt amazing. Very very cool, very fancy very neat. I felt I could be personally responsible for a great deal of the progression of computer science.</p>
                        <p>Mainly, I want to fix the distinction between the Computer Science degree and Software Development. &gt;:I I was rather displeased at how little theory I learned in my degree.</p>
                        <p>With that great excitement, I shared it with about a dozen friends and three professors as well as to ACM and arxiv. It was terribly depressing what followed.</p>
                        <p>I suppose it was just a problem with expectation management, but everywhere I looked I heard this was the biggest problem in CS and it would be quite fantastic to solve and in reality it felt as if this was not the case.</p>
                        <p>I think I know why no one really cared beyond finding it cool. I think the profs had figured &quot;There&apos;s a 99% chance this will not work, I don&apos;t want to waste my time. And in the 1% chance, I&apos;ll hear about it anyway.&quot; so alas they were all too busy to help beyond a supportive email.</p>
                        <p>I understand and I&apos;m sorry I came forth with such an inexperienced request, but I am, after all, inexperienced.</p>
                        <p>I think I could have found the hole and patched it back in February, but I had then understood what I was working for: to remain unheard trying to present an answer among those looking for answers.</p>
                        <p>And that I could not do again.</p>
                        <p>I had made a few good attempts to solve the problem throughout the summer, but I think the dread of it all being for naught stopped me from really being able to see where I needed to go.</p>
                        <p>I started really working on the problem again when I got the rejection letter from ACM, but I was not rejected for the reason I expected.</p>
                        <p>Granted, I have no idea how research in academia worked, but I really just wanted to show them this unsolved problem is no longer unsolved.</p>
                        <p>They wanted so much more than the algorithm and proof. They wanted a history book of P v NP and an explanation fit for someone who has never even heard of computers.</p>
                        <p>It was rather numbing, but I suppose it was enough motivation. I got the letter on Tuesday and said to myself if I don&apos;t finish it by Friday, I&apos;m done with the problem.</p>
                        <p>If you know the story of the man who was asked to report the sound of one hand clapping, you understand the importance of my deadline.</p>
                        <p>All this has been said simply to paint the picture of how low I&apos;ve felt while this problem has remained unsolved time and time again.</p>
                        <p>You can now understand my gratitude and joy at finding the solution to the main problem that has bested me for so long: a fixed k independent of n.</p>
                        <p>I am eternally grateful to everyone who has inspired and allowed me to work on the solution.</p>
                        <p>And I am eternally grateful for finally, after all these months, being able to finish this dang proof.</p>
                    </div>}
                </div>
            </div>
            <PDFViewer
                file={`${basePath ? basePath : ''}/sep20proofoutline.pdf`}
            />
        </div>
    );
}