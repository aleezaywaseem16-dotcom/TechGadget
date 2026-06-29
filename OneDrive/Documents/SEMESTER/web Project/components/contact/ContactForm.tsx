"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { submitContactAction } from "@/actions/contact";

const EMPTY = { name: "", email: "", subject: "", message: "" };
type ContactErrors = Partial<Record<keyof typeof EMPTY, string>>;

function validateContact(f: typeof EMPTY): ContactErrors {
  const e: ContactErrors = {};
  if (!/^[A-Za-z\s]{2,50}$/.test(f.name.trim())) e.name = "Name must be 2–50 letters only.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.subject && f.subject.length > 100) e.subject = "Subject must be under 100 characters.";
  if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  if (f.message.length > 1000) e.message = "Message must be under 1000 characters.";
  return e;
}

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const set =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    startTransition(async () => {
      const result = await submitContactAction(form);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setSent(true);
        setForm(EMPTY);
      }
    });
  };

  if (sent) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
        <p className="text-muted-foreground mb-4">
          We&apos;ll get back to you at <span className="text-foreground font-medium">{form.email || "your email"}</span> within 24 hours.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-8">
      <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={form.name}
              onChange={set("name")}
              placeholder="Ahmed Ali"
              disabled={isPending}
              className={`w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${errors.name ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"}`}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              required
              maxLength={100}
              value={form.email}
              onChange={set("email")}
              placeholder="ahmed@example.com"
              disabled={isPending}
              className={`w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${errors.email ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"}`}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Subject <span className="text-muted-foreground font-normal">(optional)</span></label>
          <input
            type="text"
            maxLength={100}
            value={form.subject}
            onChange={set("subject")}
            placeholder="Order inquiry, product question…"
            disabled={isPending}
            className={`w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${errors.subject ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"}`}
          />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            required
            rows={5}
            maxLength={1000}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us how we can help… (10–1000 characters)"
            disabled={isPending}
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none transition-colors disabled:opacity-60 ${errors.message ? "border-destructive focus:ring-destructive" : "border-input focus:ring-ring"}`}
          />
          <div className="flex justify-between items-center">
            {errors.message
              ? <p className="text-xs text-destructive">{errors.message}</p>
              : <span />}
            <p className="text-xs text-muted-foreground ml-auto">{form.message.length}/1000</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 h-11 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
