import React, { useState } from "react";
import { MOCK_FORUM_POSTS } from "../student-lms/mock-data";
import { ForumPost } from "../student-lms/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  CheckCircle2,
  Plus,
  Send,
  User,
  Paperclip,
  Tag,
  Search,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

export function StudentDiscussionForumModule() {
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("All");
  const [newQuestionModalOpen, setNewQuestionModalOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Form State for new Question
  const [newCourse, setNewCourse] = useState("CS401");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTagInput, setNewTagInput] = useState("Consensus, Exam Doubt");

  const courseCodes = ["All", "CS401", "CS402", "CS403", "CS404", "CS405", "CS406"];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseFilter === "All" || p.courseCode === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextUpvoted = !p.isUpvoted;
          return {
            ...p,
            isUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: `r-${Date.now()}`,
                author: "Aditya Verma",
                authorRole: "Student",
                authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                content: replyText,
                createdAt: "Just now",
                upvotes: 0,
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyText("");
    setActiveReplyId(null);
    toast.success("Your reply was posted!");
  };

  const handleCreateQuestion = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please enter both a title and description for your question.");
      return;
    }

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      courseCode: newCourse,
      author: "Aditya Verma",
      authorRole: "Student",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      title: newTitle,
      content: newContent,
      tags: newTagInput.split(",").map((t) => t.trim()),
      upvotes: 1,
      isUpvoted: true,
      isPinned: false,
      hasFacultyReply: false,
      createdAt: "Just now",
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewQuestionModalOpen(false);
    setNewTitle("");
    setNewContent("");
    toast.success("Question published to discussion forum!");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto min-h-screen">
      {/* HEADER CARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Discussion Forum
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ask academic questions, discuss complex theory proofs, and engage with peers & faculty.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search discussions or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700"
            />
          </div>

          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-bold text-slate-700 dark:text-slate-200"
          >
            {courseCodes.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Courses" : c}</option>
            ))}
          </select>

          <Button
            onClick={() => setNewQuestionModalOpen(true)}
            className="h-9 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Ask Question
          </Button>
        </div>
      </div>

      {/* POSTS FEED */}
      <div className="space-y-4 max-w-4xl">
        {filteredPosts.slice(0, 20).map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
          >
            {/* POST HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{post.author}</span>
                    <Badge className="text-[9px] px-1.5 py-0 font-mono bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
                      {post.authorRole}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{post.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {post.isPinned && (
                  <Pin className="h-3.5 w-3.5 text-rose-500 rotate-45" title="Pinned by Faculty" />
                )}
                <Badge variant="outline" className="font-mono font-bold text-indigo-600 border-indigo-200 text-[10px]">
                  {post.courseCode}
                </Badge>
              </div>
            </div>

            {/* CONTENT */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap items-center gap-1">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

            {/* ACTIONS BAR */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-1 text-xs font-mono font-bold transition-colors ${
                    post.isUpvoted ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${post.isUpvoted ? "fill-indigo-600" : ""}`} /> {post.upvotes} Upvotes
                </button>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> {post.replies.length} Replies
                </button>
              </div>

              {post.hasFacultyReply && (
                <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Faculty Responded
                </span>
              )}
            </div>

            {/* REPLIES SECTION */}
            {post.replies.length > 0 && (
              <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-2 pt-1">
                {post.replies.map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">{r.author}</span>
                        <Badge className="text-[8px] px-1 py-0 font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          {r.authorRole}
                        </Badge>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{r.createdAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">{r.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* REPLY INPUT */}
            {activeReplyId === post.id && (
              <div className="flex items-center gap-2 pt-2">
                <Input
                  type="text"
                  placeholder="Write a constructive response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="h-9 text-xs rounded-xl flex-1"
                />
                <Button
                  onClick={() => handleAddReply(post.id)}
                  size="sm"
                  className="h-9 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NEW QUESTION MODAL */}
      <Dialog open={newQuestionModalOpen} onOpenChange={setNewQuestionModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" /> Post New Question to Forum
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submit your academic query for peer & faculty answers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Select Course</label>
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="w-full h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-bold"
              >
                {courseCodes.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Question Title</label>
              <Input
                placeholder="e.g. How does 2-Phase Commit avoid inconsistencies?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Detailed Description</label>
              <Textarea
                placeholder="Provide full context or code snippets..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="h-24 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-semibold">Tags (Comma Separated)</label>
              <Input
                placeholder="Consensus, Raft, Exam Doubt"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="h-9 text-xs rounded-xl font-mono"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setNewQuestionModalOpen(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleCreateQuestion}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              Publish Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
