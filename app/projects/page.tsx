import Preview from "./preview";

export default function Projects() {

    const projects = [
        {
            name: '4Chess',
            description: 'A four player chess clock made for use across multiple devices on the same wifi. I designed and implemented the backend which was responsible for handling how host and client devices communicate.',
            tools: ['flutter', 'dart'],
            image: '4chess_preview.png',
            team: [
                { name: 'Deven Mallamo', url: 'https://www.linkedin.com/in/deven-mallamo/' }
            ],
            time: "2023 to 2024",
            link: "https://github.com/Quiggleson/4Chess"
        }
    ]
    return (
        <div className="">
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">Projects</h1>
                <p className="text-xl">Projects I&apos;ve enjoyed making</p>
            </div>
            {projects.map((project, i) =>
                <Preview
                    key={i}
                    props={project}
                />
            )}
            <div className="h-[20vh]"></div>
        </div>
    );
}