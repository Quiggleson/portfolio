import Image from "next/image";
import purplePic from '../public/powered_by_purple.png'
import Preview from "./components/preview";

export default function Home() {

  const previews = [
    {
      picture: "proofoutline.png",
      name: "3SAT Update - Final Proof Outline",
      description: "There was a bug in the algorithm where you had to process a clause greater than length 3 so the search was on to find the minimum length of the longest clause requiring processing. As long as this length is independent of the number of terminals, P = NP. On Sep 23rd I found a proof showing you only have to process clauses of up to length 4! The full paper is coming soon (and will replace those on this site so far), but here's a rough outline so far",
      links: [
        {
          name: "Proof Outline", 
          url: "research/3satproofoutline"
        }
      ]
    },
    {
      picture: "projects_preview.png",
      name: "Projects",
      description: "Projects I've enjoyed making",
      links: [
        {
          name: "Home", 
          url: "projects"
        }
      ]
    },
    {
      picture: "research_preview.png",
      name: "Research",
      description: "Papers I've written and ideas I'm partial to pondering",
      links: [
        {
          name: "Home", 
          url: "research"
        },
        {
          name: "3SAT 24 Sep 2024 Proof Outline", 
          url: "research/3satproofoutline",
          style: "italic"
        },
        {
          name: "A Polynomial Time Algorithm for 3SAT", 
          url: "research/3satpaper",
          style: "italic"
        },
        {
          name: "A Refutation of Popular Diagonalization Applications", 
          url: "research/refutationpaper",
          style: "italic"
        }
      ]
    },
    {
      picture: "3sat_preview.png",
      name: "3SAT",
      description: "A tool to analyze generic instances of 3SAT",
      links: [
        {
          name: "Home", 
          url: "sat"
        }
      ]
    }
  ]

  return (
    <div>
      <div className="w-screen text-center bg-slate-100 h-[80vh] place-content-center">
          <h1 className="text-7xl font-bold">Welcome!</h1>
          <p className="text-gray-500">This website houses a collection of things I find cool</p>
          <p className="text-gray-500">Click on any section below to learn more!</p>
      </div>
      <div className="mx-2 w-fit">
        <a href="https://web.archive.org/web/20170413205801/http://purple.com/" target="_blank">
          <Image width="88" height="31" alt="purple network" src={purplePic} /></a>
      </div>
      {previews.map((preview, i) => 
        <Preview 
          props={preview}
          key={i}
        />
      )}
      <div className="bg-slate-100 h-[20vh]">
      </div>
    </div>
  );
}