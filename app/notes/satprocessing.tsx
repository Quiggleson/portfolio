'use client';

import { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";

export default function SatProcessing(): ReactNode{

    const [, forceUpdate] = useState(0);
    const defaultObj = {top: 0, bottom: 0, left: 0, right: 0};
    var clauseList= useRef<{top: number, bottom: number, left: number, right: number}[]>([]);

    for (var i = 0; i < 5; i++) {
        clauseList.current.push(defaultObj);
    }

    const updateRects = () => {
        console.log("updating rects");
        for (var i = 0; i < 5; i++) {
            clauseList.current[i] = document.getElementById("" + i) ? document.getElementById("" + i)!.getBoundingClientRect() : defaultObj;
            console.log(JSON.stringify(clauseList.current[i]));
        }
        forceUpdate((n) => n + 1);
    }

    useEffect(() => {
        updateRects();
        window.addEventListener("resize", updateRects);
        return () => window.removeEventListener("resize", updateRects);
    }, []);


    return (
        <div>
            <p>Alright, what&apos;s going on around here?</p>
            <p>Couple problems I see:</p>
            <ul className="list-inside list-disc">
                <li>It&apos;s no longer shortest on the left to longest on the right. Solution: add a column field in Clause</li>
                <li>The nitty gritty of processing with unknown terms</li>
                <li>Regarding expansion, we know every term in input exists in the output</li>
            </ul>
            <p>First, iterate expansions as expansion</p>
            <div className="pl-8">
                <p>If input.length &gt;= output.length -&gt; throw error</p>
                <p>If input is missing one term and output knows all terms -&gt; make a new instance for each possible new term</p>
            </div>
            <p>Alright, gonna implement a bit and come back</p>
            <p>Woah, woah, woah woah. You have lost sight of the goal. Let&apos;s recap what we know</p>
            <p>Consider</p>
            <div className="grid grid-cols-3 w-fit my-5">
                <p className="font-bold">n-1</p>
                <p className="font-bold">n</p>
                <p className="font-bold">n-1</p>

                <p id="0" className="w-fit px-1">A := [&alpha;]</p>
                <p id="2" className="w-fit px-1">C := [&alpha; &#8746; a]</p>
                <p></p>

                <p id="1" className="w-fit px-1">B := [&beta;]</p>
                <p id="3" className="w-fit px-1 mr-3">D := [&beta; &#8746; b]</p>
                <p id="4" className="w-fit px-1">E := [&delta;]</p>

            </div>
            Here we can derive the final clause without processing an n-terminal clause with the following knowledge:
            <ul className="list-inside list-disc">
                <li>C and D contain opposite form terms to derive E. Say i &isin; C and -i &isin; D</li>
                <li>i is either in &alpha; OR a, but not both (since the lengths of the clauses limit a from being in &alpha;)</li>
                <li>Similarly, -i is either in &beta; or B.</li>
                <li>Consider four cases: 1) i &isin; &alpha; and -i &isin; &beta; 2) i &isin; &alpha; and -i &isin; b 3) i &isin; a and -i &isin; &beta; 4) i &isin; a and -i &isin; b</li>
                <ul className="list-inside list-disc pl-8">
                    <li>1) i &isin; &alpha; and -i &isin; &beta;</li>
                    <li>Then the non-i terms in A and B are just &delta; and A and B can be processed directly to imply E</li>
                    <li>2) i &isin; &alpha; and -i &isin; b</li>
                    <li>Since -i is not in &beta;, &beta; = &delta; and we already have E</li>
                    <li>3) i &isin; a and -i &isin; &beta;</li>
                    <li>Since i is not in &alpha;, &alpha; = &delta; and we already have E</li>
                    <li>4) i &isin; a and -i &isin; b</li>
                    <li>Since i is not in &alpha; and -i is not in &beta;, &alpha; = &beta; = &delta; and we definitely already have E</li>
                </ul>
            </ul>
            This proves we never have to process an n-terminal clause. However, this proof is ezpez because the first half of the graph is simple expansion from each clause to the next. The fact that we shortcut this expansion in case 1) makes it rather difficult to generalize this. In fact, there is a case where it&apos;s proven that if we only have n-2 terminal clauses and we go up to n-1-terminal clauses (by expansion and/or implication), then there is no way to shortcut an existing implication. I am quite hoping that with n-3 to n-2 to n-1 to n-2 to n-3, there is a way to shortcut the n-1, regardless of if its n-2 to n-1 by simple expansion or if it&apos;s n-2 to n-1 by implication. They key to this lies in the fact that there&apos;s another n-2 to n-3 reduction and the terms get quite restricted which may allow for a cap on the length of the output clauses.
            <svg className="absolute top-0 left-0 h-full w-full -z-10">
                <line 
                    x1={clauseList.current[0].right}
                    y1={(clauseList.current[0].bottom + clauseList.current[0].top)/2}
                    x2={clauseList.current[2].left}
                    y2={(clauseList.current[2].bottom + clauseList.current[2].top)/2}
                    className="stroke-button-hover stroke-2"
                />
                <line 
                    x1={clauseList.current[1].right}
                    y1={(clauseList.current[1].top + clauseList.current[1].bottom)/2}
                    x2={clauseList.current[3].left}
                    y2={(clauseList.current[3].top+clauseList.current[3].bottom)/2}
                    className="stroke-button-hover stroke-2"
                />
                <line 
                    x1={clauseList.current[2].right}
                    y1={(clauseList.current[2].bottom + clauseList.current[2].top)/2}
                    x2={(clauseList.current[2].right + clauseList.current[4].left)/2}
                    y2={(clauseList.current[2].bottom + clauseList.current[2].top)/2}
                    className="stroke-button-hover stroke-2"
                />
                <line 
                    x1={clauseList.current[3].right}
                    y1={(clauseList.current[3].bottom + clauseList.current[3].top)/2}
                    x2={clauseList.current[4].left}
                    y2={(clauseList.current[4].bottom + clauseList.current[4].top)/2}
                    className="stroke-button-hover stroke-2"
                />
                <line 
                    x1={(clauseList.current[2].right + clauseList.current[4].left)/2}
                    x2={(clauseList.current[2].right + clauseList.current[4].left)/2}
                    y1={(clauseList.current[2].bottom + clauseList.current[2].top)/2}
                    y2={(clauseList.current[3].bottom + clauseList.current[3].top)/2}
                    className="stroke-button-hover stroke-2"
                />
            </svg>
        </div>
    );
}