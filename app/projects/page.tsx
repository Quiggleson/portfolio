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
        },
        {
            name: 'Scribe',
            description: 'Oakland University Senior Project. Scribe is an AI-powered transcription and summarization tool which allows students to upload a lecture video and receive a transcript, written summary, audible summary, and visual summary. I was responsible for designing and implementing the API.',
            tools: ['python', 'FastAPI', 'Jira', 'exposure to Docker'],
            image: 'scribe_preview.png',
            team: [
                { name: 'Matt Curtis', url: 'https://www.linkedin.com/in/matthew-curtis-96432717a/' },
                { name: 'Dan Mocnick', url: 'https://www.linkedin.com/in/daniel-mocnik/' },
                { name: 'Matthew Israil', url: 'https://www.linkedin.com/in/matthew-israil-076a6820a/' },
                { name: 'Aaron Bryan', url: 'https://www.linkedin.com/in/aaron-bryan-2ba38b293/' },
                { name: 'Vincent Schmick', url: 'https://www.linkedin.com/in/vincent-schmick-456886216/' },
                
            ],
            time: "Jan to April 2024",
            link: "https://github.com/PhysCorp/scribe"
        }
    ]
    return (
        <div className="">
            <div className="ml-2 mt-2 mb-10">
                <h1 className="text-3xl">Projects</h1>
                <p className="text-xl">Projects I&apos;ve enjoyed making</p>
            </div>
            {projects.map((project, i) =>
                <div key={i}>
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