import { Mode, useGraphStore } from "@/app/store/useGraphStore";
import { ReactNode } from "react";

export default function Modal(
    { header, body }:
        {
            header: string,
            body: ReactNode
        }
) {

    const setMode = useGraphStore((state) => state.setMode)

    const handleClose = async () => {
        setMode(Mode.waiting)
    }

    return (
        <>
            <div className="absolute top-0 h-full w-full pointer-events-none bg-scrim">
            </div>
            <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-fit min-h-[200px] h-fit rounded-lg">
                <div className="w-full bg-surface-dark p-2 rounded-t-lg flex justify-between">
                    <div>{header}</div>
                    <button className="pl-2" onClick={handleClose}>Close</button>
                </div>
                <div className="pr-5 bg-surface h-full rounded-b-lg">
                    {body}
                </div>
            </div>
        </>
    )
}