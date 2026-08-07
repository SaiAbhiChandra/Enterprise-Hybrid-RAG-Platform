import type { LucideIcon } from "lucide-react";

interface Props {

    title: string;

    value: number | string;

    subtitle: string;

    icon: LucideIcon;

    color:
        | "blue"
        | "purple"
        | "green"
        | "orange";

}

const colors = {

    blue: {

        bg: "bg-blue-50",

        icon: "text-blue-600",

        border: "border-blue-100",

    },

    purple: {

        bg: "bg-violet-50",

        icon: "text-violet-600",

        border: "border-violet-100",

    },

    green: {

        bg: "bg-green-50",

        icon: "text-green-600",

        border: "border-green-100",

    },

    orange: {

        bg: "bg-orange-50",

        icon: "text-orange-600",

        border: "border-orange-100",

    },

};

export default function StatCard({

    title,

    value,

    subtitle,

    icon: Icon,

    color,

}: Props) {

    const style = colors[color];

    return (

        <div className={`rounded-2xl border ${style.border} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>

                    <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">

                        {value}

                    </h2>

                    <p className="mt-2 text-sm text-slate-500">

                        {subtitle}

                    </p>

                </div>

                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg}`}>

                    <Icon

                        size={26}

                        className={style.icon}

                    />

                </div>

            </div>

        </div>

    );

}