'use client';

import { useState } from "react";

const basePath = process.env.ROOT_PATH;

// Preview pages on the home page
export interface PreviewProps {
    picture: string,
    name: string,
    description: string,
    links: { name: string, url: string, style?: string }[]
}

export default function Preview({ props }: { props: PreviewProps }) {

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="relative group text-xl">
            <div className="absolute inset-0 bg-fixed bg-center blur-sm group-hover:blur-none transition-filter ease-in-out duration-500" style={{ backgroundImage: "url(" + basePath + props.picture + ")" }}>
            </div>
            <div className="relative z-10 w-full">
                <button onClick={() => setExpanded(!expanded)} className="w-full h-full">
                    <div className="h-[40vh]"></div>
                    <div className="pl-2 bg-bg-light h-fit py-2">
                        <div className="flex">
                            <div>{props.name}</div>
                            {!expanded && <div className="pl-2">+</div>}
                            {expanded && <div className="pl-2">-</div>}
                        </div>
                        <div className={`overflow-hidden justify-items-start transition-max-height duration-500 ease-in-out ${expanded ? 'max-h-[250px]' : 'max-h-0'}`}>
                            <div className="w-fit text-gray-500">{props.description}</div>
                            {props.links.map((link, i) =>
                                <div key={i} className="ml-6 pl-2 rounded flex hover:bg-slate-100">
                                    <a href={link.url} className={link.style ? link.style : ""}>{link.name}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}