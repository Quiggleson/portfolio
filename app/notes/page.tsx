'use client';

import { useState } from "react";
import SatRefactor from "./satrefactor";
import SatProcessing from "./satprocessing";
import LargeClause from "./largeclause";
import ClauseRedesign from "./clauseredesign";
import DownloadExample from "./downloadexample";
import August7 from "./august7";

export default function Notes() {

    const [sections, setSections] = useState<string[]>([]);

    function toggleSection(section: string) {
        if (sections.includes(section)) {
            setSections([...sections.filter((s) => s !== section)]);
        } else {
            setSections([...sections, section])
        }
    }

    return (
        <div>
            <div className="container mx-auto w-fit my-2 text-center">
                <h1 className="text-xl">Development Notes</h1>
                <p>Here&apos;s some notes from development</p>
            </div>
            <div className="m-2 mx-4 text-justify">
                <h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('1')}>+</button>Rendering lines for 3SAT implication graph</h1>
                {sections.includes('1') && <div>
                    <p>[18 July 2024]</p>
                    <p>Alright, let&apos;s see here. The old solution put an SVG in the background which took up the entire page. Alas, this got a bit difficult with the top nav bar. Additionally, I can imagine the page will get quite large so tying the height to the viewport will not quite be adequate. Perhaps I can iterate the clauses first, take the largest x, y and set the width and height to that. Gotta double check the offset with the top nav bar as well.</p>
                    <p>Alright, what&apos;s going on?</p>
                    <p>The position of the clauses is relative to the view</p>
                    <p>The SVG starts right below the top nav</p>
                    <p>Either find a way to get the position relative to the parent div or move the SVG to start at the top of the view</p>
                    <p>[SOLUTION]</p>
                    <p>Lol just had to set fixed instead of absolute. Alright now it&apos;s time for cleaner lines B)</p>
                    <p>[Reopened]</p>
                    <p>jk that didn&apos;t work, it has to support scrolling so the svg can&apos;t be fixed, it has to be relative to the parent div. Alright what do we want?</p>
                    <p>Draw 4 lines:</p>
                    <ul>
                        <li>parent1.right to xmedian</li>
                        <li>parent2.right to xmedian</li>
                        <li>child.left to xmedian</li>
                        <li>But what if the child is on the right?</li>
                    </ul>
                    <p>Hmm let&apos;s try diagram-js. Naaaahhhh I like the idea of designing and understanding everything</p>
                    <p>Looks like adding an event listener then updating families works good enough for now. Although it could get quite slow. Good enough for now</p>
                </div>}
                <h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('2')}>+</button>SAT Refactor</h1>
                {sections.includes('2') &&
                    <SatRefactor />
                }
                <h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('3')}>+</button>Process Clauses</h1>
                {sections.includes('3') &&
                    <SatProcessing />
                }
                <h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('4')}>+</button>Large Implication Graph Example</h1>
                {sections.includes('4') &&
                    <LargeClause />
                }
                <h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('5')}>+</button>Clause Redesign</h1>
                {sections.includes('5') &&
                    <ClauseRedesign />
                }
                <h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('6')}>+</button>[August 6] Download Example + Notes</h1>
                {sections.includes('6') &&
                    <DownloadExample />
                }<h1 className="font-bold"><button className="p-2" onClick={() => toggleSection('7')}>+</button>[August 7] Dev notes</h1>
                {sections.includes('7') &&
                    <August7 />
                }
            </div>
        </div>
    );
}