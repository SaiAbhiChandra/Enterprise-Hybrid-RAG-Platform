interface Props {

    inline?: boolean;

    className?: string;

    children?: React.ReactNode;

}

export default function CodeBlock({

    inline,

    children,

}: Props) {

    if (inline) {

        return (

            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-indigo-600">

                {children}

            </code>

        );

    }

    return (

        <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-5 text-sm text-slate-100">

            <code>

                {children}

            </code>

        </pre>

    );

}