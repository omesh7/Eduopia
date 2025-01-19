import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getUserQuizzes } from "../_actions/quiz"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { QuizCard } from './quizCard'


export default async function QuizListPage() {
    const supabase = createClient();
   
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const userId = user.id
    const userQuizzes = await getUserQuizzes(userId)

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">My Quizzes</h1>
            {userQuizzes.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl mb-4">You haven&apos;t created any quizzes yet.</p>
                    <Link href="/home/new">
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            Create Your First Quiz
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {userQuizzes.map((quiz) => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                    <div className="text-center">
                        <Link href="/home/new">
                            <Button type='button' variant={'secondary'} >
                                <Plus className="w-5 h-5" />
                                Create New Quiz
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}