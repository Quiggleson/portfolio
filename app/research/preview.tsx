'use client';

import Link from "next/link";
import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

// Preview pages on the home page
export interface PreviewProps {
    name: string,
    abstract: string,
    date: string,
    url: string
}

export default function Preview({ props }: { props: PreviewProps }) {

    return (
        <div className="relative group text-xl">
            <div className="relative z-10 w-full">
                <Link href={props.url} className="w-full h-full">
                    <div className="pl-2 bg-bg-light hover:bg-slate-200 h-fit py-2">
                        <div className="text-lg text-gray-500 text-left italic">{props.date}</div>
                        <div>{props.name}</div>
                        <div className="text-justify text-gray-500 mx-8">{props.abstract}</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}