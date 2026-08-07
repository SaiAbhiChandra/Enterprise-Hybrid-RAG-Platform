import {
    Bot,
    User,
} from "lucide-react";

import Markdown from "./Markdown";
import SourceCard from "./SourceCard";

interface Props {

    role: "user" | "assistant";

    content: string;

    sources?: any[];

}

export default function ChatMessage({

    role,

    content,

    sources,

}: Props) {

    const isUser =
        role === "user";

    return (

        <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>

            {!isUser && (

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100">

                    <Bot
                        size={20}
                        className="text-indigo-600"
                    />

                </div>

            )}

            <div className="max-w-[82%]">

                <div

                    className={`rounded-3xl border px-6 py-5 shadow-sm ${
                        isUser
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-800"
                    }`}

                >

                    <Markdown content={content} />

                </div>

                {!isUser &&

                    sources &&

                    sources.length > 0 && (

                        <div className="mt-5 grid gap-3">

                            {sources.map((source, index) => (

                                <SourceCard

                                    key={index}

                                    source={source}

                                />

                            ))}

                        </div>

                    )}

            </div>

            {isUser && (

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-200">

                    <User
                        size={20}
                        className="text-slate-700"
                    />

                </div>

            )}

        </div>

    );

}