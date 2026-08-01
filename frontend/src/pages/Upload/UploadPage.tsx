import UploadCard from "../../components/upload/UploadCard";

export default function UploadPage() {

    return (

        <div className="max-w-3xl">

            <h1 className="text-4xl font-bold">

                Document Upload

            </h1>

            <p className="mt-2 text-slate-400">

                Upload enterprise documents for AI retrieval.

            </p>

            <div className="mt-8">

                <UploadCard />

            </div>

        </div>

    );

}