import {
    Clock3,
    FileText,
} from "lucide-react";

interface Activity {

    title: string;

    description: string;

    created_at: string;

}

interface Props {

    activities: Activity[];

}

export default function RecentActivity({

    activities,

}: Props) {

    return (

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-semibold text-slate-900">

                    Recent Activity

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Latest activity in your workspace

                </p>

            </div>

            <div className="divide-y divide-slate-100">

                {activities.length === 0 && (

                    <div className="p-10 text-center text-slate-400">

                        No recent activity.

                    </div>

                )}

                {activities.map((item, index) => (

                    <div
                        key={index}
                        className="flex items-center justify-between px-6 py-5 transition hover:bg-slate-50"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <FileText size={18} />

                            </div>

                            <div>

                                <h3 className="font-medium text-slate-900">

                                    {item.title}

                                </h3>

                                <p className="mt-1 text-sm text-slate-500">

                                    {item.description}

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-400">

                            <Clock3 size={15} />

                            {new Date(item.created_at).toLocaleDateString()}

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}