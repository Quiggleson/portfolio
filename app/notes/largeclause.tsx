import { MutableRefObject, useRef, useState, useEffect } from "react";

export default function LargeClause() {

    const [, forceUpdate] = useState(0);
    const clauseCount = 39;
    const height = useRef(0);
    const defaultObj = { top: 0, bottom: 0, left: 0, right: 0 };
    // var clauseList: MutableRefObject<{ top: number, bottom: number, left: number, right: number }>[] = [];
    const clauseList = useRef<{ top: number, bottom: number, left: number, right: number }[]>([]);


    for (var i = 0; i < clauseCount; i++) {
        // clauseList.current = [...clauseList.current, useRef(defaultObj)];
        clauseList.current.push(defaultObj);
    }

    const updateRects = () => {
        // console.log("updating rects");
        for (var i = 0; i < clauseCount; i++) {
            clauseList.current[i] = document.getElementById("" + i) ? document.getElementById("" + i)!.getBoundingClientRect() : defaultObj;
            // clauseList.current[i] = document.getElementById("" + i) ? document.getElementById("" + i)!.getBoundingClientRect() : defaultObj;
            console.log(JSON.stringify(clauseList.current[i]));
        }
        height.current = clauseList.current[0].bottom - clauseList.current[0].top;
        forceUpdate((n) => n + 1);
    }

    useEffect(() => {
        updateRects();
        window.addEventListener("resize", updateRects);
        return () => window.removeEventListener("resize", updateRects);
    }, []);

    return (<div>
        <p>As seen in the last section, if we have n-1-terminal clauses that expand up to n-terminal clauses which collapse back down to n-1-terminal clauses, we can skip processing of the n-terminal clauses to save computation time. However, ideally there exists a general scenario where you can say &quot;given input clauses of length X that originally went up to length Y then back down to length Z, we can derive the output clauses without processing a clause greater than length K&quot;. If K here is independent of the number of terminals, P = NP. So that would be rather neat if it existed. Let&apos;s look at an example from n-3 to n-2 to n-1 to n to n-1 to n-2 to n-3. Oh boy, this is gonna be a big one.</p>
        <div className="grid grid-cols-7 my-5">
            <p className="font-bold">n-3</p>
            <p className="font-bold">n-2</p>
            <p className="font-bold">n-1</p>
            <p className="font-bold">n</p>
            <p className="font-bold">n-1</p>
            <p className="font-bold">n-2</p>
            <p className="font-bold">n-3</p>

            <p id="0" className="w-fit px-1">AA</p>
            <p id="1" className="w-fit px-1">AB</p>
            <p id="2" className="w-fit px-1">AC</p>
            <p id="3" className="w-fit px-1">AD</p>
            <p></p>
            <p></p>
            <p></p>

            <p id="4" className="w-fit px-1">AE</p>
            <p id="5" className="w-fit px-1">AF</p>
            <p id="6" className="w-fit px-1">AG</p>
            <p id="7" className="w-fit px-1">AH</p>
            <p id="8" className="w-fit px-1">AI</p>
            <p></p>
            <p></p>

            <p id="9" className="w-fit px-1">AJ</p>
            <p id="10" className="w-fit px-1">AK</p>
            <p id="11" className="w-fit px-1">AL</p>
            <p id="12" className="w-fit px-1">AM</p>
            <p></p>
            <p></p>
            <p></p>

            <p id="13" className="w-fit px-1">AN</p>
            <p id="14" className="w-fit px-1">AO</p>
            <p id="15" className="w-fit px-1">AP</p>
            <p id="16" className="w-fit px-1">AQ</p>
            <p id="17" className="w-fit px-1">AR</p>
            <p id="18" className="w-fit px-1">AS</p>
            <p></p>

            <p id="19" className="w-fit px-1">AT</p>
            <p id="20" className="w-fit px-1">AU</p>
            <p id="21" className="w-fit px-1">AV</p>
            <p id="22" className="w-fit px-1">AW</p>
            <p></p>
            <p></p>
            <p></p>

            <p id="23" className="w-fit px-1">AX</p>
            <p id="24" className="w-fit px-1">AY</p>
            <p id="25" className="w-fit px-1">AZ</p>
            <p id="26" className="w-fit px-1">BA</p>
            <p id="27" className="w-fit px-1">BB</p>
            <p></p>
            <p></p>

            <p id="28" className="w-fit px-1">BC</p>
            <p id="29" className="w-fit px-1">BD</p>
            <p id="30" className="w-fit px-1">BE</p>
            <p id="31" className="w-fit px-1">BF</p>
            <p></p>
            <p></p>
            <p></p>

            <p id="32" className="w-fit px-1">BG</p>
            <p id="33" className="w-fit px-1">BH</p>
            <p id="34" className="w-fit px-1">BI</p>
            <p id="35" className="w-fit px-1">BJ</p>
            <p id="36" className="w-fit px-1">BK</p>
            <p id="37" className="w-fit px-1">BL</p>
            <p id="38" className="w-fit px-1">BM</p>

        </div>
        <p>Now what can we say about this?</p>
        <div className="pl-8">
            <p>New terms are added in the left half</p>
            <p>There are no new terms in the right half (any clause on the right half can trace all of its terms back to the left)</p>
            <p>The clauses that are part of implications share opposite form terms, we can assign arbitrary terms to them in the meantime</p>
            <div className="pl-8">
                <p>a &isin; AD and -a &isin; AH</p>
                <p>b &isin; AM and -b &isin; AQ</p>
                <p>c &isin; AW and -c &isin; BA</p>
                <p>d &isin; BF and -d &isin; BJ</p>
                <p>e &isin; AI and -e &isin; AR</p>
                <p>f &isin; BB and -f &isin; BK</p>
                <p>g &isin; AS and -g &isin; BL</p>
            </div>
            <p>Considering an opposite form term like a, it could either be in AA or the new term in AB or the new term in AC. Similarly for the remaining opposite form terms.</p>
            <p>One fun thing: recall we want to derive the final n-3-t clause without processing an n-1-t clause. So if we can shortcut such that we skip an n-1-t clause, it would be beneficial. Now look at AS. This clause contains all the terms from AD, AH, AM, and AQ if you subtract any opposite form terms (a, -a, b, -b, e, -e). So if any clause in this path shorter than n-1 (AA, AE, AJ, AN, AB, AF, AK, AO) does not contain any of these opposite form terms, then we can derive AS directly from that clause (they&apos;re either equal or we can use expansion). In short, cases such as these are rather straightforward so any further consideration should really only consider the case where all of these clauses contain at least one opposite form term that&apos;s not in AS.</p>
            <p>Note the following restrictions: </p>
            <div className="pl-8">
                <p>any given clause cannot contain both forms of an opposite form term</p>
                <p>opposite form terms from one group cannot be the same as opposite form terms from another group (ie, a and b cannot be e). However, a and b could be equal. (In fact this equality may be forced and may hold the key to forcing a K independent of n).</p>
            </div>
            <p>Now we have some cases: a must be new in AA, AB, AC, or AD.</p>
            <p>The cases around e are a bit finnicky because it can be in the path of AA to AD or AE to AH or both.</p>
            <p>Consider a &isin; AA, then 5 options for e (AA, AB, AC, AD, or none)</p>
            <p>Consider e &isin; AA, then 4 options for a (AA, AB, AC, or AD)</p>
            <p>Subtract 1 from that since it covers a and e in AA twice</p>
            <p>Consider -a &isin; AE, then 5 options for e</p>
            <p>Consider e &isin; AE, then 4 options for -a</p>
            <p>Subtract 1 since -a and e in AE is counted twice</p>
            <p>Subtract 1 from total since there&apos;s one case where e is in none for both routes, but that&apos; not a valid case</p>
            <p>We have (9-1)*(9-1)-1 = 63 cases for the whereabouts of a, -a, and e</p>
            <p>---</p>
            <p>I do believe this would be insufficient. Intuitively, n-3 to n-2 to n-1 to n to n-1 to n-2 seems like it would require processing an n-1-t clause in at least one case. However, we have more information. We know there&apos;s an opposite form term, g, shared by AS and BL. So g is also somewhere in one of these clauses. Dang, that&apos;s a lotta cases.</p>
        </div>


        <svg className="absolute top-0 left-0 h-full w-full -z-10">
            <line
                x1={clauseList.current[0].right}
                y1={clauseList.current[0].top + height.current / 2}
                x2={clauseList.current[1].left}
                y2={clauseList.current[1].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[1].right}
                y1={clauseList.current[1].top + height.current / 2}
                x2={clauseList.current[2].left}
                y2={clauseList.current[2].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[2].right}
                y1={clauseList.current[2].top + height.current / 2}
                x2={clauseList.current[3].left}
                y2={clauseList.current[3].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[3].right}
                y1={clauseList.current[3].top + height.current / 2}
                x2={(clauseList.current[3].right + clauseList.current[8].left) / 2}
                y2={clauseList.current[3].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 2 */}
            <line
                x1={clauseList.current[4].right}
                y1={clauseList.current[4].top + height.current / 2}
                x2={clauseList.current[5].left}
                y2={clauseList.current[5].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[5].right}
                y1={clauseList.current[5].top + height.current / 2}
                x2={clauseList.current[6].left}
                y2={clauseList.current[6].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[6].right}
                y1={clauseList.current[6].top + height.current / 2}
                x2={clauseList.current[7].left}
                y2={clauseList.current[7].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[7].right}
                y1={clauseList.current[7].top + height.current / 2}
                x2={clauseList.current[8].left}
                y2={clauseList.current[8].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[8].right}
                y1={clauseList.current[8].top + height.current / 2}
                x2={(clauseList.current[8].right + clauseList.current[18].left) / 2}
                y2={clauseList.current[8].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 3 */}
            <line
                x1={clauseList.current[9].right}
                y1={clauseList.current[9].top + height.current / 2}
                x2={clauseList.current[10].left}
                y2={clauseList.current[10].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[10].right}
                y1={clauseList.current[10].top + height.current / 2}
                x2={clauseList.current[11].left}
                y2={clauseList.current[11].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[11].right}
                y1={clauseList.current[11].top + height.current / 2}
                x2={clauseList.current[12].left}
                y2={clauseList.current[12].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[12].right}
                y1={clauseList.current[12].top + height.current / 2}
                x2={(clauseList.current[12].right + clauseList.current[17].left) / 2}
                y2={clauseList.current[12].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 4 */}
            <line
                x1={clauseList.current[13].right}
                y1={clauseList.current[13].top + height.current / 2}
                x2={clauseList.current[14].left}
                y2={clauseList.current[14].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[14].right}
                y1={clauseList.current[14].top + height.current / 2}
                x2={clauseList.current[15].left}
                y2={clauseList.current[15].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[15].right}
                y1={clauseList.current[15].top + height.current / 2}
                x2={clauseList.current[16].left}
                y2={clauseList.current[16].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[16].right}
                y1={clauseList.current[16].top + height.current / 2}
                x2={clauseList.current[17].left}
                y2={clauseList.current[17].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[17].right}
                y1={clauseList.current[17].top + height.current / 2}
                x2={clauseList.current[18].left}
                y2={clauseList.current[18].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[18].right}
                y1={clauseList.current[18].top + height.current / 2}
                x2={(clauseList.current[18].right + clauseList.current[38].left) / 2}
                y2={clauseList.current[18].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 5 */}
            <line
                x1={clauseList.current[19].right}
                y1={clauseList.current[19].top + height.current / 2}
                x2={clauseList.current[20].left}
                y2={clauseList.current[20].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[20].right}
                y1={clauseList.current[20].top + height.current / 2}
                x2={clauseList.current[21].left}
                y2={clauseList.current[21].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[21].right}
                y1={clauseList.current[21].top + height.current / 2}
                x2={clauseList.current[22].left}
                y2={clauseList.current[22].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[22].right}
                y1={clauseList.current[22].top + height.current / 2}
                x2={(clauseList.current[22].right + clauseList.current[27].left) / 2}
                y2={clauseList.current[22].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 6 */}
            <line
                x1={clauseList.current[23].right}
                y1={clauseList.current[23].top + height.current / 2}
                x2={clauseList.current[24].left}
                y2={clauseList.current[24].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[24].right}
                y1={clauseList.current[24].top + height.current / 2}
                x2={clauseList.current[25].left}
                y2={clauseList.current[25].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[25].right}
                y1={clauseList.current[25].top + height.current / 2}
                x2={clauseList.current[26].left}
                y2={clauseList.current[26].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[26].right}
                y1={clauseList.current[26].top + height.current / 2}
                x2={clauseList.current[27].left}
                y2={clauseList.current[27].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[27].right}
                y1={clauseList.current[27].top + height.current / 2}
                x2={(clauseList.current[27].right + clauseList.current[37].left) / 2}
                y2={clauseList.current[27].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 7 */}
            <line
                x1={clauseList.current[28].right}
                y1={clauseList.current[28].top + height.current / 2}
                x2={clauseList.current[29].left}
                y2={clauseList.current[29].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[29].right}
                y1={clauseList.current[29].top + height.current / 2}
                x2={clauseList.current[30].left}
                y2={clauseList.current[30].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[30].right}
                y1={clauseList.current[30].top + height.current / 2}
                x2={clauseList.current[31].left}
                y2={clauseList.current[31].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[31].right}
                y1={clauseList.current[31].top + height.current / 2}
                x2={(clauseList.current[31].right + clauseList.current[36].left) / 2}
                y2={clauseList.current[31].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Row 8 - The final row! */}
            <line
                x1={clauseList.current[32].right}
                y1={clauseList.current[32].top + height.current / 2}
                x2={clauseList.current[33].left}
                y2={clauseList.current[33].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[33].right}
                y1={clauseList.current[33].top + height.current / 2}
                x2={clauseList.current[34].left}
                y2={clauseList.current[34].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[34].right}
                y1={clauseList.current[34].top + height.current / 2}
                x2={clauseList.current[35].left}
                y2={clauseList.current[35].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[35].right}
                y1={clauseList.current[35].top + height.current / 2}
                x2={clauseList.current[36].left}
                y2={clauseList.current[36].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[36].right}
                y1={clauseList.current[36].top + height.current / 2}
                x2={clauseList.current[37].left}
                y2={clauseList.current[37].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={clauseList.current[37].right}
                y1={clauseList.current[37].top + height.current / 2}
                x2={clauseList.current[38].left}
                y2={clauseList.current[38].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Vertical Lines n to n-1 */}
            <line
                x1={(clauseList.current[3].right + clauseList.current[8].left) / 2}
                y1={clauseList.current[3].top + height.current / 2}
                x2={(clauseList.current[3].right + clauseList.current[8].left) / 2}
                y2={clauseList.current[8].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={(clauseList.current[12].right + clauseList.current[17].left) / 2}
                y1={clauseList.current[12].top + height.current / 2}
                x2={(clauseList.current[12].right + clauseList.current[17].left) / 2}
                y2={clauseList.current[17].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={(clauseList.current[22].right + clauseList.current[27].left) / 2}
                y1={clauseList.current[22].top + height.current / 2}
                x2={(clauseList.current[22].right + clauseList.current[27].left) / 2}
                y2={clauseList.current[27].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={(clauseList.current[31].right + clauseList.current[36].left) / 2}
                y1={clauseList.current[31].top + height.current / 2}
                x2={(clauseList.current[31].right + clauseList.current[36].left) / 2}
                y2={clauseList.current[36].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Vertical Lines n-1 to n-2 */}
            <line
                x1={(clauseList.current[8].right + clauseList.current[18].left) / 2}
                y1={clauseList.current[8].top + height.current / 2}
                x2={(clauseList.current[8].right + clauseList.current[18].left) / 2}
                y2={clauseList.current[18].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            <line
                x1={(clauseList.current[27].right + clauseList.current[37].left) / 2}
                y1={clauseList.current[27].top + height.current / 2}
                x2={(clauseList.current[27].right + clauseList.current[37].left) / 2}
                y2={clauseList.current[37].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
            {/* Vertical Lines n-2 to n-3 */}
            <line
                x1={(clauseList.current[18].right + clauseList.current[38].left) / 2}
                y1={clauseList.current[18].top + height.current / 2}
                x2={(clauseList.current[18].right + clauseList.current[38].left) / 2}
                y2={clauseList.current[38].top + height.current / 2}
                className="stroke-button-hover stroke-2"
            />
        </svg>
    </div>);
}