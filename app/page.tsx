import Image from "next/image";
import purplePic from '../public/powered_by_purple.png'

export default function Home(){
  return (
  <div>
    <div className="container mx-auto w-fit my-2 text-center">
      <h1 className="text-xl">Welcome!</h1>
      <p>This website is a collection of things I find cool</p>
    </div>
    <div className="m-2 mx-4 text-justify">
      <h1 className="font-bold">What&apos;s all this then?</h1>
      <p>This is a collection of things I find cool. It contains various items such as some papers I&apos;ve worked on, some things I find interesting, and some beautiful music to name a few. I am most excited about the 3SAT program I&apos;m working on which allows one to input descriptions of clauses and it will return helpful information about the implication graph. </p>
      <h1 className="font-bold">What&apos;s next?</h1>
      <ul>
        <li>Finish 3SAT page</li>
        <li>Upload Refutation Paper</li>
        <li>About page</li>
      </ul>
      <h1 className="font-bold">When&apos;s all this then?</h1>
      <p>In case I get very tired and stop working on this, this website was under development July 2024.</p>
    </div>
    <div className="mx-2">
      <a href="https://web.archive.org/web/20170413205801/http://purple.com/" target="_blank">
      <Image width="88" height="31" alt="purple network" src={purplePic} /></a>
    </div>
  </div>
  );
}