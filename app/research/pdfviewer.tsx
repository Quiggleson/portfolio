'use client';

import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

pdfjs.GlobalWorkerOptions.workerSrc = basePath + '/pdfjs-dist/pdf.worker.min.mjs';

export default function PDFViewer({ file }: { file: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState(1); // State for zoom scale

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function goToPrevPage() {
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    }

    function goToNextPage() {
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
    }

    function zoomIn() {
        setScale(prevScale => prevScale * 1.2); // Increase scale by 20%
    }

    function zoomOut() {
        setScale(prevScale => Math.max(prevScale / 1.2, 0.2)); // Decrease scale by 20%, with a minimum limit
    }

    return (
        <div className="max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="text-lg">
                    Page {pageNumber} of {numPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={zoomOut}
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                    Zoom Out
                </button>
                <span className="text-lg">
                    Zoom: {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={zoomIn}
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                    Zoom In
                </button>
            </div>
            <div className="flex justify-center">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} scale={scale} className="w-full max-w-full" />
                </Document>
            </div>
        </div>
    );
}