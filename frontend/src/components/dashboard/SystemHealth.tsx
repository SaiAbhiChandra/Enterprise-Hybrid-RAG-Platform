import {
    CheckCircle2,
    Cpu,
    Database,
    Server,
    BrainCircuit,
} from "lucide-react";

interface Health {

    name: string;

    status: string;

}

interface Props {

    health: Health[];

}

function getIcon(name: string) {

    const value = name.toLowerCase();

    if (value.includes("postgres"))

        return Database;

    if (value.includes("qdrant"))

        return Server;

    if (value.includes("embedding"))

        return BrainCircuit;

    return Cpu;

}

export default function SystemHealth({

    health,

}: Props) {

    return (

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-semibold text-slate-900">

                    System Health

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Current infrastructure status

                </p>

            </div>

            <div className="space-y-4 p-6">

                {health.map(service => {

                    const Icon = getIcon(service.name);

                    return (

                        <div

                            key={service.name}

                            className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-slate-50"

                        >

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                    <Icon size={20} />

                                </div>

                                <div>

                                    <h3 className="font-medium text-slate-900">

                                        {service.name}

                                    </h3>

                                    <p className="text-sm text-slate-500">

                                        Enterprise Service

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">

                                <CheckCircle2

                                    size={16}

                                    className="text-emerald-600"

                                />

                                <span className="text-sm font-semibold text-emerald-700">

                                    {service.status}

                                </span>

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>

    );

}