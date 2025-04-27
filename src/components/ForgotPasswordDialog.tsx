
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "./PasswordInput";

type Step = "email" | "otp" | "reset" | "success";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [storedUser, setStoredUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);

  // Simulate sending OTP
  const handleSendOtp = () => {
    setError(null);
    const usersRaw = localStorage.getItem("users");
    if (!usersRaw) {
      setError("No users found.");
      return;
    }

    const users = JSON.parse(usersRaw);
    const foundUser = users.find((u: any) => u.email === email);
    if (!foundUser) {
      setError("Email not registered.");
      return;
    }

    setStoredUser(foundUser);
    const genOtp = generateOTP();
    setSentOtp(genOtp);
    // In a real app, this would send to email!
    alert(`OTP (for demo): ${genOtp}`);
    setStep("otp");
  };

  const handleOtpVerify = () => {
    if (otp === sentOtp) {
      setStep("reset");
      setResetError(null);
    } else {
      setResetError("OTP does not match.");
    }
  };

  const handleResetPassword = () => {
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    const usersRaw = localStorage.getItem("users");
    if (!usersRaw) {
      setResetError("No users found.");
      return;
    }
    const users = JSON.parse(usersRaw);
    const updatedUsers = users.map((u: any) => {
      if (u.email === storedUser.email) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setStep("success");
  };

  // Clear all on close
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setResetError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        {step === "email" && (
          <>
            <DialogHeader>
              <DialogTitle>Forgot password?</DialogTitle>
              <DialogDescription>
                Enter your registered email. You will receive an OTP to reset your password.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full mt-2" onClick={handleSendOtp}>
              Send OTP
            </Button>
          </>
        )}
        {step === "otp" && (
          <>
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
              <DialogDescription>
                We have sent a 6-digit OTP to your email (shown here for demo).
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
            />
            {resetError && <p className="text-sm text-destructive">{resetError}</p>}
            <Button className="w-full mt-2" onClick={handleOtpVerify}>
              Verify OTP
            </Button>
          </>
        )}
        {step === "reset" && (
          <>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your new password below.
              </DialogDescription>
            </DialogHeader>
            <PasswordInput
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-2"
            />
            {resetError && <p className="text-sm text-destructive">{resetError}</p>}
            <Button className="w-full mt-2" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </>
        )}
        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Password reset!</DialogTitle>
              <DialogDescription>
                Your password has been reset. Please login with your new password.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full mt-4" onClick={() => handleDialogChange(false)}>
              Close
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
