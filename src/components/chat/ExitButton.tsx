import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MouseEventHandler } from "react"

export function ExitButton({onClick}:{onClick:MouseEventHandler<HTMLButtonElement>}) {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={onClick}
      className="rounded-full border-2 border-red-500 bg-transparent hover:bg-red-500/10 text-red-500 h-10 w-10"
    >
      <X className="h-6 w-6" strokeWidth={3} />
      <span className="sr-only">Exit</span>
    </Button>
  )
}