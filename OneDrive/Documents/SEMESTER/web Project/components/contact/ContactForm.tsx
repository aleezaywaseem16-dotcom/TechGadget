"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { submitContactAction } from "@/actions/contact";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const set =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              value={form.name}
              onChange={set("name")}
              placeholder="Ahmed Ali"
              disabled={isPending}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-60"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="ahmed@example.com"
              disabled={isPending}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={set("subject")}
            placeholder="Order inquiry, product question…"
            disabled={isPending}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us how we can help…"
            disabled={isPending}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors disabled:opacity-60"
          />
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
