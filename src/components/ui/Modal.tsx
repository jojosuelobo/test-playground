"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  testId: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, testId, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      data-testid="modal-overlay"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
        data-testid={testId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            data-testid={`${testId}-close-button`}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
