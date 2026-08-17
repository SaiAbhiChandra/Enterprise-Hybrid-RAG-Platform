import FusionMark from "../brand/FusionMark";

const PROMPTS = [
    "Summarize the key points across my uploaded documents",
    "What does the refund policy say about late requests?",
    "Compare the two most recently uploaded documents",
    "Find any mention of pricing or cost figures",
];

type Props = {
    onPick: (prompt: string) => void;
};

export default function EmptyState({ onPick }: Props) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-4">
            <FusionMark size={40} />

            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text">
                Ask YourChat anything
            </h1>

            <p className="mt-1.5 max-w-sm text-center text-sm text-text-muted">
                Answers are grounded in your uploaded documents using hybrid
                retrieval and cross-encoder reranking.
            </p>

            <div className="mt-7 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {PROMPTS.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => onPick(prompt)}
                        className="rounded-xl border border-border bg-surface px-3.5 py-3 text-left text-sm text-text-muted transition hover:border-accent/40 hover:text-text"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
}
