"use client";

import { useState, type FormEvent } from "react";
import { LIMITS, TOPICS, validateContact, type ContactErrors, type ContactInput, type Topic } from "../lib/contact";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

const EMPTY: ContactInput = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [topic, setTopic] = useState<Topic | null>(null);

  // Errors show once a field has been left (or on submit), then update as the visitor types.
  const set = (field: keyof ContactInput, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validateContact(next));
  };
  const blur = (field: keyof ContactInput) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateContact(values));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(found).length) {
      // aria-invalid isn't rendered yet, so pick the field from `found` directly.
      const first = (["name", "email", "message"] as const).find((f) => found[f]);
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const company = new FormData(e.currentTarget).get("company");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topic: topic ?? "other", company }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: "sent" });
        setValues(EMPTY);
        setTopic(null);
        setTouched({});
        return;
      }
      if (data.errors) setErrors(data.errors);
      setStatus({ kind: "error", message: data.error || "Please fix the highlighted field." });
    } catch {
      setStatus({ kind: "error", message: "Couldn’t reach the server. Check your connection and try again." });
    }
  };

  const field = (name: keyof ContactInput) => ({
    id: `cf-${name}`,
    name,
    value: values[name],
    onChange: (e: { target: { value: string } }) => set(name, e.target.value),
    onBlur: () => blur(name),
    "aria-invalid": touched[name] && errors[name] ? true : undefined,
    "aria-describedby": touched[name] && errors[name] ? `cf-${name}-error` : undefined,
  });
  const error = (name: keyof ContactInput) =>
    touched[name] && errors[name] ? (
      <p id={`cf-${name}-error`} className="cf-error">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <fieldset className="cf-topics">
        <legend>What&rsquo;s this about? (optional)</legend>
        <div className="cf-topic-list">
          {TOPICS.map((t) => (
            <label key={t.value} className="cf-topic">
              <input
                type="radio"
                name="topic"
                value={t.value}
                checked={topic === t.value}
                onChange={() => setTopic(t.value)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">Name</label>
          <input {...field("name")} type="text" autoComplete="name" maxLength={LIMITS.name} required />
          {error("name")}
        </div>
        <div className="cf-field">
          <label htmlFor="cf-email">Email</label>
          <input
            {...field("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            maxLength={LIMITS.email}
            required
          />
          {error("email")}
        </div>
      </div>
      <div className="cf-field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          {...field("message")}
          rows={5}
          maxLength={LIMITS.message}
          placeholder={
            topic === "website"
              ? "What’s the site for, and when do you need it?"
              : topic === "job"
                ? "The role, the team, and how to reach you."
                : undefined
          }
          required
        />
        {error("message")}
      </div>
      {/* Honeypot for bots; hidden from people and assistive tech */}
      <div className="cf-trap" aria-hidden="true">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="cf-foot">
        <button type="submit" className="cf-submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </button>
        <p className={`cf-status${status.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
          {status.kind === "sent" && "Thanks. Your message is on its way, and I’ll reply to your email."}
          {status.kind === "error" && status.message}
        </p>
      </div>
    </form>
  );
}
