'use client';

export default function TopNav() {
    
    const buttons = [
        // Warning: home will link incorrectly on github pages
        {name: 'Home', link: '/'},
        {name: '3SAT', link: 'sat'},
        {name: 'Example', link: '/'},
        {name: 'Example', link: '/'},
    ];

    return (
        <div className="w-screen h-14 border-b border-black sticky mx-auto">
            <div className="w-1/2 float-right flex justify-between mx-5">
            {buttons.map((button, i) => <a key={i} className="rounded p-2 m-2 mx-6 hover:bg-sky-500" href={button.link}>{button.name}</a>)}
            </div>
        </div>
    );
}