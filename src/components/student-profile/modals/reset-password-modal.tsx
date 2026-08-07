import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, Loader2, Check, X } from "lucide-react";
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

  const [touchedCurrent, setTouchedCurrent] = useState(false);
  const [touchedNew, setTouchedNew] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Reset fields on modal close/open
  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setTouchedCurrent(false);
      setTouchedNew(false);
      setTouchedConfirm(false);
      setIsLoading(false);
    }
  }, [open]);

  // Validation checks
  const isMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

  const isNewPasswordValid = isMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  const passwordsMatch = newPassword === confirmPassword;
  const isDifferentFromCurrent = currentPassword !== newPassword || currentPassword === "";
  const allFilled = currentPassword.trim() !== "" && newPassword.trim() !== "" && confirmPassword.trim() !== "";

  const canSubmit = allFilled && isNewPasswordValid && passwordsMatch && currentPassword !== newPassword;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully.");
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-3 border-slate-200 dark:border-slate-800">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" /> Reset Account Password
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Set a secure password for your student ERP portal access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdatePassword} className="space-y-4 py-3">
          
          {/* Current Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setNewPassword(newPassword)} // Dummy reference to prevent unused warning if any, but we actually update setCurrentPassword
                onChangeCapture={(e) => setCurrentPassword((e.target as HTMLInputElement).value)}
                onBlur={() => setTouchedCurrent(true)}
                className="pr-10 rounded-xl text-xs h-9 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touchedCurrent && currentPassword.trim() === "" && (
              <p className="text-[11px] text-rose-500 font-medium">Current password is required.</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChangeCapture={(e) => setNewPassword((e.target as HTMLInputElement).value)}
                onBlur={() => setTouchedNew(true)}
                className="pr-10 rounded-xl text-xs h-9 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Validation Checklist UI */}
            {touchedNew && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 mt-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password Requirements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {isMinLength ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className={isMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                      Min 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {hasUppercase ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className={hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {hasLowercase ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className={hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {hasNumber ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className={hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:col-span-2">
                    {hasSpecialChar ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className={hasSpecialChar ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                      One special character (e.g. @, #, $, %)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {touchedNew && currentPassword !== "" && currentPassword === newPassword && (
              <p className="text-[11px] text-rose-500 font-medium">New password must be different from current password.</p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeCapture={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                onBlur={() => setTouchedConfirm(true)}
                className="pr-10 rounded-xl text-xs h-9 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touchedConfirm && confirmPassword.trim() === "" && (
              <p className="text-[11px] text-rose-500 font-medium">Confirm password is required.</p>
            )}
            {touchedConfirm && confirmPassword.trim() !== "" && !passwordsMatch && (
              <p className="text-[11px] text-rose-500 font-medium">Confirm password does not match the new password.</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
