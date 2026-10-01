'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { EvidenceClass } from '@/data/types';
export function Badge({ type, children }: { type: EvidenceClass | 'DEMO'; children?: ReactNode }) {
  return <span className={`tag ${type.toLowerCase()}`}>{children || type}</span>;
}
export function Modal({
  title,
  onClose,
  children,
  wide = false,
  className = '',
  scrollBody = true,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  className?: string;
  scrollBody?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
      el?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'wide' : ''} ${className}`}
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-button" aria-label="Close panel" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {scrollBody ? <div className="modal-body">{children}</div> : children}
    </dialog>
  );
}
export function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
  ends,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  ends?: [string, string];
}) {
  return (
    <label className="range-control">
      <span>
        <strong>{label}</strong>
        <output>
          {value}
          {suffix}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {ends && (
        <span className="range-ends">
          <small>{ends[0]}</small>
          <small>{ends[1]}</small>
        </span>
      )}
    </label>
  );
}
