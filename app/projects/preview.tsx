'use client';

import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_ROOT_PATH;

// Preview pages on the home page
export interface PreviewProps {
    name: string,
    tools: string[],
    description: string,
    image: string,
    team: { name: string, url: string }[],
    link: string,
    time: string
}

export default function Preview({ props }: { props: PreviewProps }) {

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="justify-center flex">
            <div className="relative group text-xl w-[90vw]">
                <div className="absolute inset-0 bg-fixed bg-center blur-sm group-hover:blur-none transition-filter ease-in-out duration-500" style={{ backgroundImage: "url(" + props.image + ")" }}>
                </div>
                <div className="relative z-10 w-full">
                    <button onClick={() => setExpanded(!expanded)} className="w-full h-full">
                        <div className="h-[40vh]"></div>
                        <div className="pl-2 bg-bg-light h-fit py-2">
                            <div className="text-lg text-gray-500 text-left italic">{props.time}</div>
                            <a href={props.link} className="flex hover:bg-slate-200 underline text-blue-800" target="_blank">{props.name}</a>
                            <div className={`overflow-hidden justify-items-start transition-max-height duration-500 ease-in-out h-fit`}>
                                <div className="flex text-left">{props.description}</div>
                                <div className="flex">
                                    <div className="w-fit">Tools - </div>
                                    {props.tools.map((tool, i) =>
                                        <div key={i} className="w-fit italic ml-2">{tool}{(i !== props.tools.length - 1) ? ', ' : ' '}</div>
                                    )}
                                </div>
                                <div className="flex">Team -</div>
                                {props.team.map((member, i) =>
                                    <a key={i} href={member.url} className="ml-4 flex hover:bg-slate-200 underline text-blue-800" target="_blank">{member.name}</a>
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}