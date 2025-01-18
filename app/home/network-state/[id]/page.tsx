"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Search } from 'lucide-react'
import { Card, CardContent } from "@/components/main/card"
import { Input } from "@/components/main/input"
import { Avatar, AvatarFallback } from "@/components/main/avatar"
import { PollCard } from "../_components/poll-card"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/main/sheet"
import { CreateProposalForm } from "../_components/create-proposal-form"
import { Button } from "@/components/main/button"
import { discussions, proposals } from "../_data/mock_data"
import { networkStates } from "../_data/mock_data"

// Define the Proposal interface
interface Proposal {
  id: number;
  question: string;
  description: string;
  startTime: string;
  endTime: string;
  votes: number;
  networkState: string;
  logo: string;
  votingEnds: string;
}

// Define the Discussion interface
interface Discussion {
  id: number;
  author: string;
  username: string;
  timeAgo: string;
  avatar: string;
  content: string;
  reactions: string[];
  replies?: number;
  shares?: number;
  likes?: number;
}

// Create a Discussion component
function DiscussionItem({ discussion }: { discussion: Discussion }) {
  return (
    <div className="border-b border-gray-100 py-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>{discussion.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{discussion.author}</span>
            <span className="text-sm text-gray-500">@{discussion.username}</span>
            <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
          </div>
          <p className="mt-2 text-gray-700">{discussion.content}</p>
          <div className="mt-3 flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <span>💭</span>
              <span>{discussion.replies || 0}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <span>🔄</span>
              <span>{discussion.shares || 0}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <span>❤️</span>
              <span>{discussion.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NetworkStatePage() {
  const [localProposals, setLocalProposals] = useState<Proposal[]>(proposals)
  const [isCreateProposalOpen, setIsCreateProposalOpen] = useState(false)
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  
  const state = networkStates.find((s) => s.id === parseInt(params.id as string))

  // Filter proposals based on search query
  const filteredProposals = useMemo(() => {
    return localProposals.filter(proposal =>
      proposal.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [localProposals, searchQuery])

  // Filter discussions based on search query
  const filteredDiscussions = useMemo(() => {
    return discussions.filter(discussion =>
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleCreateProposal = (proposalData: {
    question: string
    description: string
    startTime: string
    endTime: string
  }) => {
    const newProposal: Proposal = {
      id: localProposals.length + 1,
      ...proposalData,
      votes: 0,
      networkState: state?.name || "DeSci",
      logo: state?.logo || "/placeholder.svg",
      votingEnds: calculateVotingEnds(proposalData.endTime)
    }

    setLocalProposals(prev => [...prev, newProposal])
    setIsCreateProposalOpen(false)
  }

  // Helper function to calculate voting ends display string
  const calculateVotingEnds = (endTime: string): string => {
    const end = new Date(endTime)
    const now = new Date()
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return "1 day"
    if (diffDays <= 3) return "3 days"
    if (diffDays <= 7) return "1 week"
    if (diffDays <= 14) return "2 weeks"
    return "1 month"
  }

  if (!state) return <div>Network State not found</div>

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with dark background */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={state.logo ?? "/placeholder.svg"}
                alt={state.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h1 className="text-lg font-semibold">{state.name}</h1>
                <p className="text-sm text-gray-400">{state.memberCount}</p>
              </div>
            </div>
            <div className="flex flex-col w-full sm:flex-row sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10 w-full bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet open={isCreateProposalOpen} onOpenChange={setIsCreateProposalOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto bg-white text-black hover:bg-gray-100">
                    Create Proposal
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Create New Proposal</SheetTitle>
                    <SheetDescription>Fill in the details for your new proposal.</SheetDescription>
                  </SheetHeader>
                  <CreateProposalForm onSubmit={handleCreateProposal} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Trending Polls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Trending Polls</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">View All →</button>
            </div>
            {filteredProposals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No proposals found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProposals.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            )}
          </div>

          {/* Discussions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Discussions</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">View All →</button>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-4 divide-y divide-gray-100">
                {filteredDiscussions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No discussions found matching your search.</p>
                  </div>
                ) : (
                  filteredDiscussions.map((discussion, index) => (
                    <DiscussionItem key={index} discussion={discussion} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

