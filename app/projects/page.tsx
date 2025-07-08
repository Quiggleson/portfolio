import Preview from "./preview";
import { projects } from "../models/projects";

export default function Projects() {
    return (
        <div className="">
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">Projects</h1>
                <p className="text-xl">Projects I&apos;ve enjoyed making</p>
            </div>
            {projects.map((project, i) =>
                <div key={i} id={project.name}>
                    <Preview
                        props={project}
                    />
                    <div className="h-[5vh]"></div>
                </div>
            )}
            <div className="h-[20vh]"></div>
        </div>
    );
}