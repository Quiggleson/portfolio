import instance from '../../public/instance.json';
import { downloadJSON } from '../utils/download';

export default function DownloadExample() {

    return (
        <div>
            <div>Click <button className="rounded outline outline-2 px-1 hover:bg-button-hover" onClick={() => downloadJSON('instance.json', instance)}>here</button> to download example instance to be used with SATv2</div>
            <div>Note that it&apos;s still a bit finnicky when rendering lines, so you may have to hit e, shift, or ctrl to update the state and render the connection lines</div>
        </div>
    );
}