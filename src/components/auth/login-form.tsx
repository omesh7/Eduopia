"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  signIn: (formData: FormData) => Promise<void>;
  signUp: (formData: FormData) => Promise<void>;
  message?: string;
}

export default function LoginForm({
  className,
  signIn,
  signUp,
  message,
  ...props
}: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Card className={cn("w-full max-w-md bg-card", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {isSignUp ? "Sign Up" : "Login"}
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form action={isSignUp ? signUp : signIn}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              required
              className="bg-muted/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <SubmitButton className="w-full">
            {isSignUp ? "Sign Up" : "Login"}
          </SubmitButton>
          <div className="text-sm text-center text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </div>
          {message && (
            <p className="text-sm text-muted-foreground text-center">
              {message}
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

function SubmitButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      disabled={pending}
      {...props}
    >
      {pending ? "Processing..." : children}
    </Button>
  );
}
