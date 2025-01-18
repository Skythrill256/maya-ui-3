'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Card, CardContent } from "@/components/main/card"
import { Share2, Search } from 'lucide-react'
import { Button } from "@/components/main/button"
import { Avatar, AvatarFallback } from "@/components/main/avatar"
import { Input } from "@/components/main/input"
import { polls } from "@/app/home/_components/polls"

// Separate countdown component that uses the hook
function CountdownDisplay({ endTime }: { endTime: string }) {
  const timeLeft = useCountdown(endTime)
  return <span>Voting ends in {timeLeft}</span>
}

function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const [hours, minutes, seconds] = endTime.split(':').map(Number)
      const now = new Date()
      const target = new Date(now)
      target.setHours(hours, minutes, seconds)

      if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 1)
      }

      const diff = target.getTime() - now.getTime()
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return timeLeft
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('')
  const [votedPolls, setVotedPolls] = useState<Record<string, boolean>>({})

  const filteredPolls = useMemo(() => {
    return polls.filter(poll =>
      poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleVote = useCallback((pollId: string) => {
    setVotedPolls(prev => ({
      ...prev,
      [pollId]: !prev[pollId]
    }))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search polls..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolls.map((poll) => (
          <Card key={poll.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {poll.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                  <p className="text-sm font-medium leading-tight">
                    {poll.question}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <CountdownDisplay endTime={poll.votingEndsAt} />
                    <Button
                      variant={votedPolls[poll.id] ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(poll.id)}
                      className="text-xs px-3 py-1 h-auto"
                    >
                      {votedPolls[poll.id] ? 'Voted' : '1692 Votes'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
