'use client';

const basePath = process.env.ROOT_PATH;

export default function TopNav() {
    
    const buttons = [
        // Warning: home will link incorrectly on github pages
        {name: 'Localhost Home', link: '/'},
        {name: '3SAT', link: 'sat'},
        {name: 'SATv2', link: 'satv2'},
        {name: 'GH Pages Home', link: '/portfolio'},
        {name: 'Notes', link: 'notes'},
    ];

    return (
        <div className="w-screen h-14 border-b bg-bg-light border-black top-0 sticky z-50 overflow-x-auto flex items-center flex-row-reverse">
            <div className="flex justify-end min-w-max space-x-4 pr-5">
                {buttons.map((button, i) => (
                    <a key={i} className="rounded p-2 hover:bg-button-hover whitespace-nowrap" href={basePath + button.link}>
                        {button.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
