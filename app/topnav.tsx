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
        <div className="w-screen h-14 border-b border-black top-0 sticky bg-purple-com z-50 overflow-x-auto flex items-center flex-row-reverse">
            <div className="flex justify-end min-w-max space-x-4 pr-5">
                {buttons.map((button, i) => (
                    <a key={i} className="rounded p-2 hover:bg-purple-hover whitespace-nowrap" href={button.link}>
                        {button.name}
                    </a>
                ))}
            </div>
        </div>
    );
}


// 'use client';

// export default function TopNav() {
    
//     const buttons = [
//         // Warning: home will link incorrectly on github pages
//         {name: 'Localhost Home', link: '/'},
//         {name: '3SAT', link: 'sat'},
//         {name: 'GH Pages Home', link: '/portfolio'},
//         {name: 'Example', link: '/'},
//     ];

//     return (
//         <div className="w-screen h-14 border-b border-black top-0 sticky mx-auto bg-purple-com z-50 overflow-x-auto">
//             <div className="float-right flex justify-between mx-5 overflow-x-auto">
//             {buttons.map((button, i) => <a key={i} className="rounded p-2 m-2 mx-6 hover:bg-purple-hover whitespace-nowrap" href={button.link}>{button.name}</a>)}
//             </div>
//         </div>
//     );
// }