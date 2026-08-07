import ReactMarkdown from "react-markdown";

import CodeBlock from "./CodeBlock";

interface Props {

    children: string;

}

export default function Markdown({

    children,

}: Props) {

    return (

        <div className="prose prose-slate max-w-none prose-p:leading-7 prose-code:text-indigo-600">

            <ReactMarkdown

                components={{

                    code(props) {

                        const code = String(props.children).replace(/\n$/, "");

                        const language = props.className?.replace("language-", "") ?? "";

                        return (

                            <CodeBlock

                                language={language}

                                code={code}

                            />

                        );

                    },

                }}

            >

                {children}

            </ReactMarkdown>

        </div>

    );

}