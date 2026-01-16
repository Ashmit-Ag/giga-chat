import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MouseEventHandler } from "react"

export function NextButton({onClick}:{onClick:MouseEventHandler<HTMLButtonElement>}) {
  return (
    <Button 
      variant="default" 
      size="icon" 
      onClick={onClick}
      className="rounded-full bg-white hover:bg-gray-200 text-black h-10 w-10 shadow-lg"
    >
      <ChevronRight className="h-6 w-6" strokeWidth={3} />
      <span className="sr-only">Next</span>
    </Button>
  )
}