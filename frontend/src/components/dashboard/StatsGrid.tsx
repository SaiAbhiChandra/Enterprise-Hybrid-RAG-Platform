import {
    BrainCircuit,
    Database,
    FileText,
    MessageSquare,
    TrendingUp,
} from "lucide-react";

interface Props {
    documents: number;
    chunks: number;
    chats: number;
    accuracy: number;
}

const stats = (
    documents: number,
    chunks: number,
    chats: number,
    accuracy: number
) => [
    {
        title: "Documents",
        value: documents,
        subtitle: "Indexed",
        icon: FileText,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Vector Chunks",
        value: chunks,
        subtitle: "Embedded",
        icon: Database,
        color: "bg-violet-50 text-violet-600",
    },
    {
        title: "AI Chats",
        value: chats,
        subtitle: "Sessions",
        icon: MessageSquare,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Accuracy",
        value: `${accuracy}%`,
        subtitle: "Retrieval",
        icon: BrainCircuit,
        color: "bg-amber-50 text-amber-600",
    },
];

export default function StatsGrid({
    documents,
    chunks,
    chats,
    accuracy,
}: Props) {

    return (

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {stats(documents, chunks, chats, accuracy).map((item) => {

                const Icon = item.icon;

                return (

                    <div
                        key={item.title}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    {item.title}

                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-slate-900">

                                    {item.value}

                                </h2>

                                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">

                                    <TrendingUp size={15} />

                                    {item.subtitle}

                                </div>

                            </div>

                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>

                                <Icon size={24} />

                            </div>

                        </div>

                    </div>

                );

            })}

        </section>

    );

}