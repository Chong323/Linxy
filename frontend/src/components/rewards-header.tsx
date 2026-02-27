import { Star, Trophy, Medal, Award } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Reward } from "@/types"

interface RewardsHeaderProps {
  rewards: Reward[]
  isLoading: boolean
}

export function RewardsHeader({ rewards, isLoading }: RewardsHeaderProps) {
  const getIcon = (name: string | undefined) => {
    if (!name) return <Award className="h-4 w-4 text-blue-500 fill-blue-500" />
    const lowerName = name.toLowerCase()
    if (lowerName.includes("star")) return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
    if (lowerName.includes("trophy")) return <Trophy className="h-4 w-4 text-yellow-600 fill-yellow-600" />
    if (lowerName.includes("medal")) return <Medal className="h-4 w-4 text-orange-500 fill-orange-500" />
    return <Award className="h-4 w-4 text-blue-500 fill-blue-500" />
  }

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm border-b border-blue-100 p-3">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 shrink-0">
          <Trophy className="h-4 w-4 text-blue-600" />
          <span>My Stickers</span>
        </div>
        
        {isLoading ? (
          <div className="text-xs text-blue-400 animate-pulse ml-2">Loading rewards...</div>
        ) : rewards.length === 0 ? (
          <div className="text-xs text-blue-400 italic ml-2">Start chatting to earn stickers!</div>
        ) : (
          <div className="flex gap-2">
            {rewards.map((reward, idx) => (
              <Card 
                key={reward.id || idx} 
                className="flex items-center gap-2 px-3 py-1.5 bg-white border-blue-100 shadow-sm shrink-0 min-w-[100px]"
              >
                {getIcon(reward.name)}
                <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
                  {reward.name}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
