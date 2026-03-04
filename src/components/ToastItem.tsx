import { X } from "lucide-react";
import type { Toast } from "../types/toast";

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const bgClass =
    toast.type === "success"
      ? "border-green-800 bg-green-950"
      : "border-red-800 bg-red-950";

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-text-primary shadow-lg ${bgClass}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 text-text-secondary transition-colors hover:text-text-primary"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
