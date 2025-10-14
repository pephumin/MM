import { Frame, Observable, ObservableArray } from "@nativescript/core";

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

export function createBindingContext(data: any): Observable {
  const observable = new Observable();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Array.isArray(value)) { observable.set(key, new ObservableArray(value)); } 
    else if (value && typeof value === 'object') { observable.set(key, createBindingContext(value)); } 
    else { observable.set(key, value); }
  });
  return observable;
}