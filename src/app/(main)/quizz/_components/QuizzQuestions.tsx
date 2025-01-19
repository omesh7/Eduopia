"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";
import Confetti from "react-confetti";


// import { QuestionBubble } from "./QuestionBubble";


import { z } from "zod";
import { saveSubmission } from "@/actions/quiz/saveSubmissions";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import type { InferSelectModel } from "drizzle-orm";
import type { questionAnswers, questions as DbQuestions, quizzes } from "@/db/schema";
import type { users } from "@/db/schema";

import { Header } from "./header";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { ResultCard } from "./result-card";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizz: Quizz;
  initialPercentage: number;
  initialHearts: number;
  userPlan: InferSelectModel<typeof users>['plan'];
};

export default function QuizzQuestions({ quizz, initialPercentage, initialHearts, userPlan }: Props) {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const [correctAudio, _, correctControl] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, __, incorrectControl] = useAudio({ src: "/incorrect.wav" });
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });

  const [isPending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => initialPercentage === 100 ? 0 : initialPercentage);
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = quizz.questions.findIndex(question => !question.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [selectedOption, setSelectedOption] = useState<number>();

  const currentQuestion = quizz.questions[activeIndex];
  const options = currentQuestion?.answers ?? [];

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.isCorrect);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        saveSubmission({ score: 1 }, quizz.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            correctControl.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / quizz.questions.length);

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    } else {
      startTransition(() => {
        saveSubmission({ score: 0 }, quizz.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            incorrectControl.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    }
  };

  if (!currentQuestion) {
    return (
      <>
        {finishAudio}
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={1000} />
        {correctAudio}
        {incorrectAudio}
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image src="/finish.svg" alt="finish" height={100} width={100} className="hidden lg:block" />
          <Image src="/finish.svg" alt="finish" height={50} width={50} className="block lg:hidden" />
          <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
            Great Job! <br /> You&apos;ve completed the quiz.
          </h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={quizz.questions.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={quizz.id}
          status="completed"
          onCheck={() => router.push("/dashboard")}
        />
      </>
    );
  }

  const title = currentQuestion.type === "ASSIST" ? "Select the correct meaning" : currentQuestion.questionText;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        userPlan={userPlan}
      />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-2 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>
            <div>
              {/* {currentQuestion.type === "ASSIST" && (
                <QuestionBubble question={currentQuestion.questionText} />
              )} */}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={isPending}
                type={currentQuestion.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={isPending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
}