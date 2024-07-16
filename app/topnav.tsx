'use client';

export default function TopNav() {
    
    const buttons = [
        // Warning: home will link incorrectly on github pages
        {name: 'Localhost Home', link: '/'},
        {name: '3SAT', link: 'sat'},
        {name: 'GH Pages Home', link: '/portfolio'},
        {name: 'Example', link: '/'},
    ];

    return (
        <div className="w-screen h-14 border-b border-black sticky mx-auto">
            <div className="float-right flex justify-between mx-5">
            {buttons.map((button, i) => <a key={i} className="rounded p-2 m-2 mx-6 hover:bg-sky-500 text-nowrap" href={button.link}>{button.name}</a>)}
            </div>
        </div>
    );
}