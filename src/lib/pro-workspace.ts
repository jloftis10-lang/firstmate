"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_PRO_WORKSPACE,
  parseProWorkspace,
  type AdvisorBrand,
  type ProWorkspaceState,
  type SavedCheck,
} from "./pro";

const STORAGE_KEY = "cruiseread.founding-pro.v1";
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedState = EMPTY_PRO_WORKSPACE;

function read(): ProWorkspaceState {
  if (typeof window === "undefined") return EMPTY_PRO_WORKSPACE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  if (!raw) {
    cachedState = EMPTY_PRO_WORKSPACE;
    return cachedState;
  }
  try {
    cachedState = parseProWorkspace(JSON.parse(raw));
  } catch {
    cachedState = EMPTY_PRO_WORKSPACE;
  }
  return cachedState;
}

function write(next: ProWorkspaceState): boolean {
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedState = next;
    listeners.forEach((listener) => listener());
    return true;
  } catch {
    return false;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedRaw = undefined;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProWorkspace(): ProWorkspaceState {
  return useSyncExternalStore(subscribe, read, () => EMPTY_PRO_WORKSPACE);
}

export function saveAdvisorBrand(brand: AdvisorBrand): boolean {
  const current = read();
  return write({ ...current, brand });
}

export function upsertSavedCheck(check: SavedCheck): boolean {
  const current = read();
  const checks = [check, ...current.checks.filter((item) => item.id !== check.id)].slice(0, 100);
  return write({ ...current, checks });
}

export function removeSavedCheck(id: string): boolean {
  const current = read();
  return write({ ...current, checks: current.checks.filter((item) => item.id !== id) });
}
