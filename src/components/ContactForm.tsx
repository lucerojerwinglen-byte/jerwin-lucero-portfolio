"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, User, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/Section";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { FIT_REPORT_EVENT } from "@/lib/fit/match";
import { site } from "@/content/data/site";

export function ContactForm() {
  const [reportAttached, setReportAttached] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  // The fit check hands its report over as a window event, so the two
  // sections stay independent components on the page.
  useEffect(() => {
    function onReport(e: Event) {
      setValue("message", (e as CustomEvent<string>).detail, { shouldDirty: true });
      setReportAttached(true);
      // preventScroll: the fit check is already smooth-scrolling here.
      document.getElementById("name")?.focus({ preventScroll: true });
    }
    window.addEventListener(FIT_REPORT_EVENT, onReport);
    return () => window.removeEventListener(FIT_REPORT_EVENT, onReport);
  }, [setValue]);

  async function onSubmit(values: ContactFormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      toast.success("Message sent — thanks for reaching out!");
      reset();
      setReportAttached(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Section id="contact" number="06" title="let's work together">
      <p className="mb-6 max-w-xl text-sm text-muted">
        Open to Quality Assurance, Data Analysis, and software engineering roles. Send a
        message here, or email me directly at{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        .
      </p>

      {reportAttached && (
        <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-verified/30 bg-verified/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-verified">
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          Fit report attached: add your name and email
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl space-y-4"
        data-sc-in
        data-sc-stagger="50"
      >
        {/* Honeypot field — hidden from real users via CSS, bots often fill it in. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px]"
          aria-hidden="true"
          {...register("company")}
        />

        <div>
          <label htmlFor="name" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
            <User className="h-3.5 w-3.5 text-muted" />
            Name
          </label>
          <input
            id="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 ease-[var(--ease-out)] focus:border-accent"
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
            <Mail className="h-3.5 w-3.5 text-muted" />
            Email
          </label>
          <input
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 ease-[var(--ease-out)] focus:border-accent"
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
            <MessageSquare className="h-3.5 w-3.5 text-muted" />
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 ease-[var(--ease-out)] focus:border-accent"
            {...register("message")}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-elevated inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-background disabled:pointer-events-none disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </Section>
  );
}
