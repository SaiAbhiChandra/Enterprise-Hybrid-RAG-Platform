import {
    FileText,
    ExternalLink,
} from "lucide-react";

interface Props {
    source: any;
}

export default function SourceCard({
    source,
}: Props) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">

                        <FileText
                            size={18}
                            className="text-indigo-600"
                        />

                    </div>

                    <div>

                        <h4 className="font-semibold text-slate-900">

                            {source.document_name ??
                                "Enterprise Document"}

                        </h4>

                        <p className="text-sm text-slate-500">

                            Page {source.page ?? "-"}

                        </p>

                    </div>

                </div>

                <ExternalLink
                    size={18}
                    className="text-slate-400"
                />

            </div>

            {source.score && (

                <div className="mt-4">

                    <div className="mb-1 flex justify-between text-xs">

                        <span>Confidence</span>

                        <span>

                            {(source.score * 100).toFixed(0)}%

                        </span>

                    </div>

                    <div className="h-2 rounded-full bg-slate-200">

                        <div
                            className="h-2 rounded-full bg-indigo-600"
                            style={{
                                width: `${source.score * 100}%`,
                            }}
                        />

                    </div>

                </div>

            )}

        </div>

    );

}