import React, { useState } from "react";
import { toast } from "sonner";
import { Bell, MessageSquare, UserCheck, UserX, Send, CheckCircle2, Search, Briefcase, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface ConnectionRequestItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  designation: string;
  company: string;
  batch: string;
  dept: string;
  intent: string;
  note: string;
  date: string;
  status: "pending" | "accepted" | "declined";
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
}

export interface ConnectedContact {
  id: string;
  name: string;
  avatar: string;
  company: string;
  designation: string;
  messages: ChatMessage[];
}

interface AlumniMessagingCenterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AlumniMessagingCenterModal: React.FC<AlumniMessagingCenterModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState<"requests" | "chat">("requests");

  // Incoming Requests State
  const [requests, setRequests] = useState<ConnectionRequestItem[]>([
    {
      id: "REQ-01",
      senderName: "Vishnu Prasad",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      designation: "Senior Software Engineer",
      company: "Google",
      batch: "Batch of 2021",
      dept: "Computer Science (CSE)",
      intent: "Networking & System Design",
      note: "Hi Sarah! I noticed your work on distributed cloud infrastructure. Would love to connect and exchange technical insights!",
      date: "10 mins ago",
      status: "pending",
    },
    {
      id: "REQ-02",
      senderName: "Dr. Rohan Varma",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      designation: "Postdoctoral Quantum Fellow",
      company: "Stanford AI Lab",
      batch: "Batch of 2021",
      dept: "Computer Science (CSE)",
      intent: "Research Discussion",
      note: "Hello! We are hosting an upcoming quantum AI symposium and would love to collaborate on cloud setup.",
      date: "2 hours ago",
      status: "pending",
    },
  ]);

  // Connected Contacts & Chat Threads
  const [contacts, setContacts] = useState<ConnectedContact[]>([
    {
      id: "CON-01",
      name: "Vikram Malhotra",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      company: "Qualcomm India",
      designation: "Lead Systems Architect",
      messages: [
        { id: "M1", sender: "them", text: "Hi! Thanks for accepting my connection request.", timestamp: "Yesterday 04:30 PM" },
        { id: "M2", sender: "me", text: "Glad to connect, Vikram! How are things at Qualcomm?", timestamp: "Yesterday 05:10 PM" },
        { id: "M3", sender: "them", text: "Going great! We have a few staff chip design openings if any batchmates are interested.", timestamp: "10:15 AM" },
      ],
    },
    {
      id: "CON-02",
      name: "Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      company: "CloudScale AI",
      designation: "Co-Founder & CEO",
      messages: [
        { id: "M4", sender: "them", text: "Hey Sarah! Saw your keynote at the alumni summit. Awesome presentation!", timestamp: "Aug 02" },
        { id: "M5", sender: "me", text: "Thank you Ananya! Appreciate the feedback.", timestamp: "Aug 02" },
      ],
    },
  ]);

  const [activeContactId, setActiveContactId] = useState<string>("CON-01");
  const [newMessageText, setNewMessageText] = useState("");

  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;

  const handleAcceptRequest = (req: ConnectionRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "accepted" } : r))
    );

    // Add to connected contacts
    const newContact: ConnectedContact = {
      id: `CON-${Date.now()}`,
      name: req.senderName,
      avatar: req.senderAvatar,
      company: req.company,
      designation: req.designation,
      messages: [
        { id: `M-${Date.now()}`, sender: "them", text: `Hi! ${req.note}`, timestamp: "Just now" },
        { id: `M-${Date.now()+1}`, sender: "me", text: "Connection request accepted! Great to connect with you.", timestamp: "Just now" },
      ],
    };

    setContacts((prev) => [newContact, ...prev]);
    setActiveContactId(newContact.id);
    setActiveTab("chat");

    toast.success(`Accepted connection request from ${req.senderName}!`, {
      description: "Added to your connected network. You can now direct message each other.",
      icon: <UserCheck className="size-4 text-emerald-600" />,
    });
  };

  const handleDeclineRequest = (req: ConnectionRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "declined" } : r))
    );
    toast.info(`Declined connection request from ${req.senderName}.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === activeContactId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                id: `MSG-${Date.now()}`,
                sender: "me",
                text: newMessageText,
                timestamp: "Just now",
              },
            ],
          };
        }
        return c;
      })
    );

    setNewMessageText("");

    // Simulate response after 1.5s
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeContactId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `MSG-${Date.now() + 1}`,
                  sender: "them",
                  text: "Sounds great! Thanks for getting back to me.",
                  timestamp: "Just now",
                },
              ],
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-3xl p-6">
        <div className="space-y-4 font-sans">
          <DialogHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="font-extrabold text-base flex items-center gap-2">
                <Bell className="size-5 text-[#2563EB]" /> Connection Notifications &amp; Messages
              </DialogTitle>
              <DialogDescription className="text-xs">
                Manage incoming alumni connection requests, review invitation notes, and chat 1-on-1.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* TAB SWITCHER */}
          <div className="flex items-center gap-2 border-b border-border pb-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab("requests")}
              className={`p-2 px-3.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "requests"
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-card border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              <UserCheck className="size-3.5" /> Incoming Connection Requests
              {pendingRequestsCount > 0 && (
                <Badge className="bg-rose-500 text-white text-[0.62rem] px-1.5 py-0 h-4">
                  {pendingRequestsCount}
                </Badge>
              )}
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`p-2 px-3.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-card border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              <MessageSquare className="size-3.5" /> Direct Messages ({contacts.length})
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "requests" ? (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {requests.filter((r) => r.status === "pending").length === 0 ? (
                <div className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
                  <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
                  <p className="font-bold text-foreground">No Pending Connection Requests</p>
                  <p>You are up to date with all connection invitations!</p>
                </div>
              ) : (
                requests
                  .filter((r) => r.status === "pending")
                  .map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-card border border-[#24356B]/30 space-y-3 font-sans">
                      <div className="flex items-start gap-3.5">
                        <img src={req.senderAvatar} alt={req.senderName} className="size-12 rounded-2xl object-cover border border-primary/20" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 font-mono">
                            <h4 className="font-extrabold text-sm text-foreground font-sans truncate">{req.senderName}</h4>
                            <span className="text-[0.65rem] text-muted-foreground">{req.date}</span>
                          </div>
                          <p className="text-primary font-bold font-mono text-[0.72rem]">
                            {req.designation} @ {req.company}
                          </p>
                          <span className="text-[0.68rem] text-muted-foreground font-mono block">
                            {req.batch} • {req.dept}
                          </span>
                        </div>
                      </div>

                      {/* Intent & Personal Note */}
                      <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 text-xs font-mono border border-border/50">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground text-[0.68rem]">Connection Reason:</span>
                          <Badge variant="outline" className="text-[0.62rem] bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]">
                            {req.intent}
                          </Badge>
                        </div>
                        <p className="text-foreground font-sans text-xs italic leading-relaxed">
                          "{req.note}"
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(req)}
                          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-[0.72rem] rounded-xl gap-1"
                        >
                          <UserCheck className="size-3.5" /> Accept Connection
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineRequest(req)}
                          className="h-8 text-[0.72rem] rounded-xl gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <UserX className="size-3.5" /> Decline
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          ) : (
            /* DIRECT CHAT TAB */
            <div className="grid grid-cols-3 gap-3 h-[380px] font-sans">
              {/* CONTACTS SIDEBAR */}
              <div className="border-r border-border pr-2 space-y-2 overflow-y-auto">
                <span className="font-mono text-[0.68rem] font-bold text-muted-foreground block px-1">ACTIVE CONNECTIONS</span>
                {contacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveContactId(c.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeContactId === c.id
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                        : "bg-card border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <img src={c.avatar} alt={c.name} className="size-8 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs truncate">{c.name}</p>
                      <p className={`text-[0.65rem] truncate font-mono ${activeContactId === c.id ? "text-blue-100" : "text-muted-foreground"}`}>
                        {c.company}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* CHAT WINDOW */}
              {activeContact && (
                <div className="col-span-2 flex flex-col justify-between h-full bg-card rounded-2xl border border-border p-3 space-y-3">
                  {/* CONTACT HEADER */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                    <img src={activeContact.avatar} alt={activeContact.name} className="size-9 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-extrabold text-xs text-foreground font-sans">{activeContact.name}</h4>
                      <p className="text-[0.65rem] font-mono text-primary font-bold">
                        {activeContact.designation} @ {activeContact.company}
                      </p>
                    </div>
                  </div>

                  {/* MESSAGES THREAD */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                    {activeContact.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-2.5 rounded-2xl leading-relaxed text-xs ${
                            m.sender === "me"
                              ? "bg-[#2563EB] text-white font-sans rounded-tr-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-foreground font-sans border border-border/60 rounded-tl-xs"
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[0.62rem] font-mono text-muted-foreground px-1 mt-0.5">
                          {m.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* INPUT FORM */}
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-border">
                    <Input
                      placeholder={`Message ${activeContact.name.split(" ")[0]}...`}
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="h-9 font-sans text-xs flex-1 rounded-xl"
                    />
                    <Button type="submit" size="icon" className="size-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl">
                      <Send className="size-4" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Close Center
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
