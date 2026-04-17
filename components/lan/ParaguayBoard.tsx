"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TierBadge } from "@/components/lan/TierBadge";
import { categoryLabel, type LanStartup } from "@/lib/lan";

const STORAGE_KEY = "lan-v4-paraguay-order";

export function ParaguayBoard({
  pool,
  initialOrder,
}: {
  pool: LanStartup[];
  initialOrder: string[];
}) {
  const poolSlugs = useMemo(() => pool.map((p) => p.slug), [pool]);

  const mergeOrder = (persisted: string[]): string[] => {
    const valid = persisted.filter((s) => poolSlugs.includes(s));
    const missing = poolSlugs.filter((s) => !valid.includes(s));
    return [...valid, ...missing];
  };

  const [order, setOrder] = useState<string[]>(() => {
    if (initialOrder.length > 0) return mergeOrder(initialOrder);
    return poolSlugs;
  });
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error" | "local-only"
  >("idle");

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached && initialOrder.length === 0) {
        const parsed = JSON.parse(cached) as string[];
        if (Array.isArray(parsed)) setOrder(mergeOrder(parsed));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = async (next: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setSaveState("saving");
    try {
      const res = await fetch("/api/paraguay-ranking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ order: next }),
      });
      if (res.ok) {
        const body = await res.json();
        setSaveState(body.persisted === "blob" ? "saved" : "local-only");
      } else {
        setSaveState("local-only");
      }
    } catch {
      setSaveState("local-only");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOrder((old) => {
      const oldIndex = old.indexOf(String(active.id));
      const newIndex = old.indexOf(String(over.id));
      const next = arrayMove(old, oldIndex, newIndex);
      void persist(next);
      return next;
    });
  };

  const bySlug = useMemo(
    () => new Map(pool.map((p) => [p.slug, p])),
    [pool]
  );

  const slotItems = order.slice(0, 3).map((slug) => bySlug.get(slug)!);
  const waitlistItems = order.slice(3).map((slug) => bySlug.get(slug)!);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-cyan">
            Confirmed slots
          </div>
          <SaveState state={saveState} />
        </div>
        <SortableContext
          items={order.slice(0, 3)}
          strategy={verticalListSortingStrategy}
        >
          <div className="border-2 border-cyan/40 bg-positive-light/40 rounded-sharp p-2 space-y-2 min-h-[240px]">
            {slotItems.map((s, i) => (
              <SortableRow
                key={s.slug}
                startup={s}
                position={i + 1}
                isSlot
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary mb-3">
          Waitlist
        </div>
        <SortableContext
          items={order.slice(3)}
          strategy={verticalListSortingStrategy}
        >
          <div className="border border-border-subtle bg-bg-surface rounded-sharp p-2 space-y-2">
            {waitlistItems.map((s, i) => (
              <SortableRow
                key={s.slug}
                startup={s}
                position={i + 4}
                isSlot={false}
              />
            ))}
            {waitlistItems.length === 0 && (
              <p className="text-center font-sans text-[13px] text-text-muted py-6 italic">
                No waitlist. Pool is exactly 3.
              </p>
            )}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
}

function SaveState({
  state,
}: {
  state: "idle" | "saving" | "saved" | "error" | "local-only";
}) {
  const map = {
    idle: { label: "Drag to reorder", color: "text-text-muted" },
    saving: { label: "Saving…", color: "text-text-secondary" },
    saved: { label: "Synced · cloud", color: "text-cyan" },
    "local-only": {
      label: "Saved · this browser only",
      color: "text-warning-dim",
    },
    error: { label: "Save failed", color: "text-danger-dim" },
  };
  const { label, color } = map[state];
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.1em] ${color}`}
    >
      {label}
    </span>
  );
}

function SortableRow({
  startup,
  position,
  isSlot,
}: {
  startup: LanStartup;
  position: number;
  isSlot: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: startup.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-sharp border transition-colors ${
        isSlot
          ? "bg-bg-surface border-cyan/30 hover:border-cyan"
          : "bg-bg-void border-border-subtle hover:border-border-active"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag"
        className="cursor-grab active:cursor-grabbing touch-none flex flex-col gap-0.5 px-1 text-text-muted hover:text-text-primary"
      >
        <span className="block w-4 h-[1.5px] bg-current" />
        <span className="block w-4 h-[1.5px] bg-current" />
        <span className="block w-4 h-[1.5px] bg-current" />
      </button>

      <div
        className={`font-mono text-[13px] font-semibold w-8 text-center ${
          isSlot ? "text-cyan" : "text-text-muted"
        }`}
      >
        {position}°
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/lan/${startup.slug}`}
          className="font-sans font-semibold text-[15px] text-text-primary hover:text-cyan transition-colors truncate block"
        >
          {startup.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5 font-sans text-[12px] text-text-secondary">
          <span>{categoryLabel(startup.category)}</span>
          {startup.survivalPct != null && (
            <>
              <span className="text-text-muted">·</span>
              <span className="font-mono">{startup.survivalPct}% survival</span>
            </>
          )}
          {startup.traction.note && (
            <>
              <span className="text-text-muted">·</span>
              <span className="truncate max-w-[280px]">
                {shorten(startup.traction.note, 60)}
              </span>
            </>
          )}
        </div>
      </div>

      <TierBadge tier={startup.tier} />
    </div>
  );
}

function shorten(s: string, max: number): string {
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
