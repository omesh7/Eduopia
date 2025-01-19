"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, FileType, AlertCircle,Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const SUPPORTED_FILES = ["pdf", "text", "json", "csv", "txt"]

export default function UploadDoc() {
  const [document, setDocument] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  // Handle clipboard paste
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault()
      
      // Handle pasted files
      const files = Array.from(e.clipboardData?.files || [])
      if (files.length > 0) {
        validateAndSetFile(files[0])
        return
      }

      // Handle pasted text
      const text = e.clipboardData?.getData('text')
      if (text) {
        const blob = new Blob([text], { type: 'text/plain' })
        const file = new File([blob], 'pasted-text.txt', { type: 'text/plain' })
        validateAndSetFile(file)
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files?.[0]) {
      validateAndSetFile(files[0])
    }
  }, [])

  const validateAndSetFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !SUPPORTED_FILES.includes(extension)) {
      setError(`Unsupported file type. Please use: ${SUPPORTED_FILES.join(', ')}`)
      return
    }
    setDocument(file)
    setError("")
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!document) {
      setError("Please upload a document first")
      return
    }

    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("document", document)

    try {
      const res = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData
      })
      
      if (!res.ok) {
        throw new Error("Failed to generate quiz")
      }

      const data = await res.json()
      router.push(`/quizz/${data.quizzId}`)
    } catch (err) {
      setError("Failed to generate quiz. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-all duration-200",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            document ? "border-green-500/50" : ""
          )}
        >
          <input
            type="file"
            id="document"
            accept=".pdf,.txt,.json,.csv"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileInput}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Generating your quiz...</p>
                </motion.div>
              ) : document ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <FileType className="h-10 w-10 text-green-500" />
                  <p className="text-sm font-medium">{document.name}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <Clipboard className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium">
                      Drag and drop your file here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can also paste text directly (Ctrl/Cmd + V)
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Supported file types: {SUPPORTED_FILES.join(', ')}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={!document || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Quiz 🪄</>
          )}
        </Button>
      </form>
    </div>
  )
}
