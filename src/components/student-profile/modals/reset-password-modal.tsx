import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordModal({ open, onOpenChange }: ResetPasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetAction = () => {
    if (!currentPassword || currentPassword.trim() === "") {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match. Please try again.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password reset successfully! Please use your new password next time you sign in.");
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleResetAction();
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl z-50">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Reset Account Password</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update your student portal password to keep your account secure.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          {/* CURRENT PASSWORD */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCurrent(!showCurrent);
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password (min. 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNew(!showNew);
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* CONFIRM NEW PASSWORD */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(!showConfirm);
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* SECURITY HINT BOX */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-amber-500" /> Password Security Guidelines:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
              <li>Must be at least 6 characters long</li>
              <li>Include numbers or special characters for extra safety</li>
            </ul>
          </div>

          <DialogFooter className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 px-4 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleResetAction();
              }}
              disabled={isSubmitting}
              className="h-9 px-5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isSubmitting ? "Updating..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
