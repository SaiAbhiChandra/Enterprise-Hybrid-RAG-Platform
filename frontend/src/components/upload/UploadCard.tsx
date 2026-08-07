import { useRef } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  uploadedFile?: string;
}

export default function UploadCard({
  onFileSelect,
  loading,
  uploadedFile,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl"
    >
      <div
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="
            group
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-3xl
            border-2
            border-dashed
            border-indigo-500/40
            bg-gradient-to-br
            from-slate-900
            to-slate-800
            p-16
            transition
            duration-300
            hover:border-indigo-400
            hover:scale-[1.01]
        "
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          <UploadCloud
            size={72}
            className="text-indigo-400"
          />
        </motion.div>

        <h2 className="mt-8 text-3xl font-bold text-white">
          Drag & Drop PDF
        </h2>

        <p className="mt-3 text-center text-slate-400 max-w-md">
          Upload enterprise documents to power your AI assistant with
          Retrieval-Augmented Generation.
        </p>

        <button
          className="
              mt-8
              rounded-xl
              bg-indigo-600
              px-8
              py-3
              font-semibold
              text-white
              transition
              hover:bg-indigo-500
          "
        >
          Browse Files
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={onChange}
        />
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 rounded-2xl bg-slate-800 p-5"
        >
          <div className="flex items-center gap-4">
            <Loader2
              size={28}
              className="animate-spin text-indigo-400"
            />

            <div className="flex-1">
              <p className="font-semibold">
                Uploading document...
              </p>

              <div className="mt-3 h-2 rounded-full bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    duration: 2,
                  }}
                  className="h-full rounded-full bg-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {uploadedFile && !loading && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
              mt-8
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-emerald-500/30
              bg-emerald-500/10
              p-5
          "
        >
          <CheckCircle2
            size={34}
            className="text-emerald-400"
          />

          <div className="flex-1">
            <p className="font-semibold text-white">
              Upload Complete
            </p>

            <div className="mt-1 flex items-center gap-2 text-slate-300">
              <FileText size={18} />
              {uploadedFile}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}