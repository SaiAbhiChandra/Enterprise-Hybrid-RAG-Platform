import {
    ArrowUp,
    Paperclip,
} from "lucide-react";

interface Props {

    value: string;

    loading: boolean;

    onChange: (value: string) => void;

    onSend: () => void;

}

export default function ChatInput({

    value,

    loading,

    onChange,

    onSend,

}: Props) {

    function handleKeyDown(

        e: React.KeyboardEvent<HTMLInputElement>

    ) {

        if (

            e.key === "Enter" &&

            !loading

        ) {

            onSend();

        }

    }

    return (

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center gap-3 px-5 py-4">

                <button className="rounded-xl p-2 transition hover:bg-slate-100">

                    <Paperclip
                        size={20}
                        className="text-slate-500"
                    />

                </button>

                <input

                    value={value}

                    onChange={(e) =>

                        onChange(e.target.value)

                    }

                    onKeyDown={handleKeyDown}

                    placeholder="Ask anything about your enterprise documents..."

                    className="flex-1 bg-transparent text-[15px] text-slate-800 outline-none placeholder:text-slate-400"

                />

                <button

                    onClick={onSend}

                    disabled={loading}

                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50"

                >

                    <ArrowUp size={18} />

                </button>

            </div>

        </div>

    );

}