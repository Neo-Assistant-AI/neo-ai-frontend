import { Chip } from "@material-tailwind/react";
import React from "react";

export function ComingSoon() {
    return (
        <div className="flex flex-col rounded-2xl w-full bg-white h-full shadow-lg bg-white-100 shadow-blue-gray-900/25">
            <div className="m-auto flex flex-col items-center">
            <div className="p-3 text-4xl">😎<span className="wave">⚡</span></div>
             <Chip value="Coming Soon" size="lg" variant="ghost" color="green" className="!text-3xl rounded-2xl" />
             </div>
        </div>
    );
}


export default ComingSoon;