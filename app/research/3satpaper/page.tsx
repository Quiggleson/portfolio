'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('../pdfviewer'), { ssr: false });

export default function RefutationPaper() {

    const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

    return (
        <div>
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">A Refutation of Popular Diagonalization Applications</h1>
                <a href={`${basePath ? basePath : '' }/quigley_3satpaper.pdf`} target="_blank" className="outline text-xl rounded hover:bg-bg-light px-2">Download PDF</a>
            <div className="text-warning text-xl mt-2">Disclaimer: The algorithm in this paper has a bug in it. <br /> Lemmas 5.1 - 5.10 are correct and I believe valuable for working with the problem, <br /> but Lemmas 5.11 to 5.19 are incorrect</div>
            </div>
            <PDFViewer 
            file={`${basePath ? basePath : '' }/quigley_3satpaper.pdf`}
            />
        </div>
    );
}