import {
    Bot,
} from "lucide-react";

export default function TypingIndicator() {

    return (

        <div className="flex gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100">

                <Bot
                    size={20}
                    className="text-indigo-600"
                />

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

                <div className="flex gap-2">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:150ms]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:300ms]" />

                </div>

            </div>

        </div>

    );

}