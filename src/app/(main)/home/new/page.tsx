import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UploadDoc from "../../quizz/_components/UploadDoc";

export default async function QuizPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          What do you want to be quizzed about today?
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload a document and we&apos;ll generate a quiz based on its content
        </p>
        <UploadDoc />
      </div>
    </div>
  );
}
