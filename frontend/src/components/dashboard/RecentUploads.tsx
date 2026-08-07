import {
    Calendar,
    FileText,
    HardDrive,
} from "lucide-react";

interface Upload {

    id: number;

    filename: string;

    status: string;

    size: number;

    created_at: string;

}

interface Props {

    uploads: Upload[];

}

function formatSize(size: number) {

    if (size < 1024)

        return `${size} B`;

    if (size < 1024 * 1024)

        return `${(size / 1024).toFixed(1)} KB`;

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;

}

export default function RecentUploads({

    uploads,

}: Props) {

    return (

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-semibold text-slate-900">

                    Recent Uploads

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Recently indexed enterprise documents

                </p>

            </div>

            <div className="divide-y divide-slate-100">

                {uploads.length === 0 && (

                    <div className="py-14 text-center text-slate-400">

                        No uploaded documents found.

                    </div>

                )}

                {uploads.map(file => (

                    <div

                        key={file.id}

                        className="flex items-center justify-between px-6 py-5 transition hover:bg-slate-50"

                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <FileText size={22} />

                            </div>

                            <div>

                                <h3 className="font-semibold text-slate-900">

                                    {file.filename}

                                </h3>

                                <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-slate-500">

                                    <div className="flex items-center gap-2">

                                        <HardDrive size={15} />

                                        {formatSize(file.size)}

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <Calendar size={15} />

                                        {new Date(file.created_at).toLocaleDateString()}

                                    </div>

                                </div>

                            </div>

                        </div>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                            {file.status}

                        </span>

                    </div>

                ))}

            </div>

        </section>

    );

}