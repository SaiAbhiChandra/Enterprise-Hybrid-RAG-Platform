import {
    FileSearch,
    FileText,
    Scale,
    Sparkles,
} from "lucide-react";

const prompts = [
    {
        icon: FileText,
        text: "Summarize this document",
    },
    {
        icon: Scale,
        text: "Compare two PDFs",
    },
    {
        icon: FileSearch,
        text: "Find important clauses",
    },
    {
        icon: Sparkles,
        text: "Generate executive summary",
    },
];

interface Props {
    onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({
    onSelect,
}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-2">

            {prompts.map((item) => {

                const Icon = item.icon;

                return (

                    <button

                        key={item.text}

                        onClick={() => onSelect(item.text)}

                        className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"

                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                            <Icon size={20} />

                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">

                            {item.text}

                        </h3>

                        <p className="mt-2 text-sm text-slate-500">

                            Click to instantly start this conversation.

                        </p>

                    </button>

                );

            })}

        </div>

    );

}