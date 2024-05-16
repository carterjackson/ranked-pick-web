import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/Dialog";
import { SigninForm } from "@/components/dialogs/auth/SigninForm";
import { SignupForm } from "@/components/dialogs/auth/SignupForm";

interface Props {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, handleOpenChange }: Props) {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h3>{isSigningUp ? "Sign up" : "Sign in"}</h3>
        </DialogHeader>
        {isSigningUp ? (
          <>
            <SignupForm onComplete={() => handleOpenChange(false)} />
            <p className="text-center">
              Already have an account? <button onClick={() => setIsSigningUp(false)} className="underline">Sign in</button>
            </p>
          </>
        ):(
          <>
            <SigninForm onComplete={() => handleOpenChange(false)} />
            <p className="text-center">
              Don't have an account? <button onClick={() => setIsSigningUp(true)} className="underline">Sign up</button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
