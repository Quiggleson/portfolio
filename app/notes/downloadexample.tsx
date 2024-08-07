import instance from '../../public/instance.json';
import { downloadJSON } from '../utils/download';

export default function DownloadExample() {

    return (
        <div>
            <div>Click <button className="rounded outline outline-2 px-1 hover:bg-button-hover" onClick={() => downloadJSON('instance.json', instance)}>here</button> to download example instance to be used with SATv2</div>
            <div>Note that it&apos;s still a bit finnicky when rendering lines, so you may have to hit e, shift, or ctrl to update the state and render the connection lines</div>
            <div>More notes:</div>
            <div>What else, what else to do?</div>
            <div>Let&apos;s see we&apos;ve got known and unknown. I suppose some cleaning is due before, but maybe not.</div>
            <div>I&apos;d like to iterate clauses and terms in (clause.known and not in clause.unknown.known for all clause.unknown) as (clause, term):</div>
            <div className='pl-8'>For each unknown term (with space left) in clause as unknownTerm</div>
            <div className='pl-16'>copy the instance, unknownTerm.known.add(term), do it again. Careful not to allow the same term twice in the same clause</div>
            <div>Hmmm, which class should be responsible? It feels bigger than Instance since it&apos;s a bunch of instances. Although, it is based on a single instance. Yeah let&apos;s do it from instance.</div>
        </div>
    );
}