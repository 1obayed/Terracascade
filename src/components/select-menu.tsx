'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export function SelectMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 240 });
  const search = useRef({ text: '', time: 0 });
  function show() {
    const rect = trigger.current!.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 24);
    const height = Math.min(options.length * 44 + 12, 260);
    setPosition({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      top:
        rect.bottom + height + 8 > window.innerHeight
          ? Math.max(12, rect.top - height - 6)
          : rect.bottom + 6,
      width,
    });
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (
        !trigger.current?.contains(event.target as Node) &&
        !menu.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', dismiss);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            setOpen(false);
            return;
          }
          if (event.key === 'Escape') {
            setOpen(false);
            event.stopPropagation();
            return;
          }
          if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
            event.preventDefault();
            if (!open) {
              show();
              return;
            }
            if (event.key === 'Enter' || event.key === ' ') {
              onChange(options[active].value);
              setOpen(false);
            } else
              setActive((index) =>
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? options.length - 1
                    : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
                      options.length,
              );
          } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            if (!open) show();
            const now = Date.now();
            search.current = {
              text:
                (now - search.current.time < 700 ? search.current.text : '') +
                event.key.toLowerCase(),
              time: now,
            };
            const match = options.findIndex((option) =>
              option.label.toLowerCase().startsWith(search.current.text),
            );
            if (match >= 0) setActive(match);
          }
        }}
      >
        <span>{options.find((option) => option.value === value)?.label}</span>
        <ChevronDown size={16} />
      </button>
      {open &&
        createPortal(
          <div
            ref={menu}
            id={id}
            role="listbox"
            aria-label={label}
            className="select-popup"
            style={position}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                id={`${id}-${index}`}
                role="option"
                aria-selected={option.value === value}
                className={`select-option ${active === index ? 'highlighted' : ''}`}
                onPointerMove={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={16} />}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
