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
                <div className="text-warning text-xl mt-2">Disclaimer: This presentation was made to reflect an older, faulty proof behind the algorithm. <br /> Some of the ideas are still useful, but the original paper claimed you only need to process clauses of length 3 or less where the new paper claims you need to process clauses of length 4 or less.
                </div>
            </div>
            <PDFViewer 
            file={`${basePath ? basePath : '' }/quigley_3satpresentation.pdf`}
            />
        </div>
    );
}