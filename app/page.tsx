export default function Home(){
  return (
  <div className="p-2 animate-fadeInBottom">
    <h1>Welcome!</h1>
    <p>This is a collection of some things I find cool</p>
    <br></br>
    <p>In development</p>
    <ul>
      <li>
        <a href="sat" className="hover:bg-gray-100 border rounded p-1">3SAT Shenanigans</a>
      </li>
    </ul>
    <br></br>
    <p>In planning stages</p>
    <ul>
      <li>3SAT Paper</li>
      <li>Refutation Paper</li>
    </ul>
  </div>)
  
}