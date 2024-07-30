export default function SatProcessing() {
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
        </div>
    );
}