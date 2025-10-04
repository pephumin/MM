import { Frame } from "@nativescript/core";

export function goTo(page: string) {
  Frame.topmost().navigate(page);
}

export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function SentenceCase(str: string): string {
  if (!str) { return ''; }
  else { return str.toLowerCase().replace(/(^\s*\w|\.\s*\w)/g, (c) => c.toUpperCase()); }
}

export function LowerCase(str: string): string {
  if (!str) { return ''; }
  else { return str.toLowerCase(); }
}

export function UpperCase(str: string): string {
  if (!str) { return ''; }
  else { return str.toUpperCase(); }
}