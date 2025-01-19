'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { BookOpen, Trophy } from "lucide-react"

interface QuizCardProps {
  quiz: {
    id: string
    name: string
    description: string
    questions: any[]
    submissions: any[]
  }
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (

    <Card className="h-full transition-transform ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {quiz.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {quiz.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {quiz.submissions.length} attempts
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/quizz/${quiz.id}`}>
          <Button variant="secondary" className="w-full">Start Quiz</Button>
        </Link>
      </CardFooter>
    </Card>

  )
}