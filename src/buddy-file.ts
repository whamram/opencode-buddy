import { createHmac } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { BuddyFile, CompanionBones } from "./types.js";
import { SALT } from "./engine.js";

const BUDDY_DIR = path.join(os.homedir(), ".config", "opencode-buddy");
const ALGO = "sha256";

function deriveKey(): string {
  return createHmac(ALGO, SALT).update("buddy-file-key-v1").digest("hex");
}

function computeSig(data: Omit<BuddyFile, "sig">): string {
  const payload = JSON.stringify(data);
  return createHmac(ALGO, deriveKey()).update(payload).digest("hex");
}

function buddyPath(owner: string): string {
  return path.join(BUDDY_DIR, `${owner}.buddy.json`);
}

function ensureDir(): void {
  if (!fs.existsSync(BUDDY_DIR)) {
    fs.mkdirSync(BUDDY_DIR, { recursive: true });
  }
}

export function signBuddyFile(data: Omit<BuddyFile, "sig">): string {
  return computeSig(data);
}

export function verifyBuddyFile(file: BuddyFile): boolean {
  const { sig, ...data } = file;
  return computeSig(data as Omit<BuddyFile, "sig">) === sig;
}

export function loadBuddy(owner: string): BuddyFile | null {
  const filePath = buddyPath(owner);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const file: BuddyFile = JSON.parse(raw) as BuddyFile;

    if (file.version !== 1) return null;
    if (!verifyBuddyFile(file)) return null;
    if (file.owner !== owner) return null;

    return file;
  } catch {
    return null;
  }
}

export function saveBuddy(bones: CompanionBones, owner: string): void {
  ensureDir();

  const data: Omit<BuddyFile, "sig"> = {
    version: 1,
    owner,
    hatchedAt: Math.floor(Date.now() / 1000),
    bones,
  };

  const sig = computeSig(data);
  const file: BuddyFile = { ...data, sig };

  fs.writeFileSync(buddyPath(owner), JSON.stringify(file, null, 2) + "\n", "utf-8");
}

export function exportBuddy(owner: string): string | null {
  const filePath = buddyPath(owner);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function importBuddy(srcPath: string, newOwner: string): { ok: true } | { ok: false; error: string } {
  if (!fs.existsSync(srcPath)) {
    return { ok: false, error: `File not found: ${srcPath}` };
  }

  let file: BuddyFile;
  try {
    const raw = fs.readFileSync(srcPath, "utf-8");
    file = JSON.parse(raw) as BuddyFile;
  } catch {
    return { ok: false, error: "Failed to parse buddy file" };
  }

  if (file.version !== 1) {
    return { ok: false, error: "Unsupported buddy file version" };
  }

  if (!verifyBuddyFile(file)) {
    return { ok: false, error: "Buddy file signature is invalid — file may be corrupted or tampered with" };
  }

  const data: Omit<BuddyFile, "sig"> = {
    version: 1,
    owner: newOwner,
    hatchedAt: file.hatchedAt,
    bones: file.bones,
  };

  const sig = computeSig(data);
  const newFile: BuddyFile = { ...data, sig };

  ensureDir();
  fs.writeFileSync(buddyPath(newOwner), JSON.stringify(newFile, null, 2) + "\n", "utf-8");

  return { ok: true };
}

export function isCorrupted(owner: string): boolean {
  const filePath = buddyPath(owner);
  if (!fs.existsSync(filePath)) return false;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const file = JSON.parse(raw) as BuddyFile;
    return !verifyBuddyFile(file) || file.owner !== owner;
  } catch {
    return true;
  }
}

export function deleteBuddy(owner: string): void {
  const filePath = buddyPath(owner);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}