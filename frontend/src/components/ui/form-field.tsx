import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function TextInput({ error, className, ...props }: TextInputProps) {
  return (
    <input
      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
      } ${className || ''}`}
      {...props}
    />
  );
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function TextArea({ error, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full min-h-[96px] rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
      } ${className || ''}`}
      {...props}
    />
  );
}
