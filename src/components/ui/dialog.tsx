import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Dialog = ({ open, onClose, children }: DialogProps) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <dialog
      open
      aria-modal="true"
      className="absolute top-0 left-0 w-full h-full bg-neutral-950/40"
    >
      <div
        className="w-full h-full  flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-gray-900 p-4 rounded relative min-w-96"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Button
            onClick={onClose}
            className={
              "absolute top-0 right-0 size-6 p-1 bg-gray-900 text-white"
            }
          >
            <X size={16} />
          </Button>
          <div>{children}</div>
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default Dialog;
