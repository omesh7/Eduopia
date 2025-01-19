import { cn } from "@/lib/utils";
import { Card } from "./card";

type Option = {

    id: number;
    questionId: number | null;
    answerText: string ;
    isCorrect: boolean | null;
};

type ChallengeProps = {
  options: Option[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: "ASSIST" | "SELECT";
};

export const Challenge = ({
  onSelect,
  options,
  status,
  type,
  disabled,
  selectedOption,
}: ChallengeProps) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.answerText}
          // imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          // audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};