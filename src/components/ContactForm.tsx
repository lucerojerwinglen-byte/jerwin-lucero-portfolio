"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Section } from "@/components/Section";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { site } from "@/content/data/site";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Section id="contact" eyebrow="Get in touch" title="Let's work together">
      <p className="mb-6 max-w-xl text-sm text-muted">
        Open to Quality Assurance, Data Analysis, and software engineering roles. Send a
        message here, or email me directly at{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        .
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
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
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </Section>
  );
}
