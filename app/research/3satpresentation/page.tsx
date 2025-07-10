'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('../pdfviewer'), { ssr: false });

export default function RefutationPaper() {

    const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

    return (
        <div>
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">A Refutation of Popular Diagonalization Applications</h1>
                <a href={`${basePath ? basePath : '' }/quigley_3satpresentation.pdf`} target="_blank" className="text-xl outline rounded hover:bg-bg-light px-2">Download PDF</a>
            </div>
            <div className="ml-2">
                <p className="text-warning text-xl mt-2">Disclaimer: The algorithm presented in this paper is not proven to be effective.</p>
                <p className='text-xl'>&quot;Processing an instance&quot; as described could be useful if there exists a value of k (independent of n) such the required clauses from the instance can be derived without processing a clause of length k or longer.</p>
                <p>As one could&apos;ve guessed,</p>
                <p>This was foolish at best.</p>
                <p>And it remains a test</p>
                <p>Whether P = NP</p>
            </div>
            <PDFViewer 
            file={`${basePath ? basePath : '' }/quigley_3satpresentation.pdf`}
            />
        </div>
    );
}