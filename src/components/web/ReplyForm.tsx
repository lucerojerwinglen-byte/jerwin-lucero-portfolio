"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { site } from "@/content/data/site";

export function ReplyForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      toast.success("Message sent. I’ll reply from my own email.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong", {
        description: `You can always email ${site.email}`,
      });
    }
  }

  const field = (name: "name" | "email" | "message") => ({
    id: `reply-${name}`,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `reply-${name}-err` : undefined,
    ...register(name),
  });

  return (
    <form className="reply" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot: hidden from people, often filled in by bots. */}
      <input className="hp" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register("company")} />
      <label htmlFor="reply-name">
        Name
        <input autoComplete="name" {...field("name")} />
        {errors.name && <span id="reply-name-err" className="err">{errors.name.message}</span>}
      </label>
      <label htmlFor="reply-email">
        Email
        <input type="email" autoComplete="email" {...field("email")} />
        {errors.email && <span id="reply-email-err" className="err">{errors.email.message}</span>}
      </label>
      <label htmlFor="reply-message" className="full">
        Message
        <textarea rows={3} {...field("message")} />
        {errors.message && <span id="reply-message-err" className="err">{errors.message.message}</span>}
      </label>
      <div className="actions">
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          <Send className="ico" aria-hidden="true" />
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
        <span>Usually answered within a day (UTC+8).</span>
      </div>
    </form>
  );
}
