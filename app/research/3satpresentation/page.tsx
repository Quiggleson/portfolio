'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('../pdfviewer'), { ssr: false });

export default function RefutationPaper() {

    const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

    return (
        <div>
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">A Refutation of Popular Diagonalization Applications</h1>
                <a href="/quigley_3satpresentation.pdf" target="_blank" className="text-xl rounded hover:bg-bg-light px-2">Download PDF</a>
            </div>
            <PDFViewer 
            file={`${basePath ? basePath : '' }/quigley_3satpresentation.pdf`}
            />
        </div>
    );
}