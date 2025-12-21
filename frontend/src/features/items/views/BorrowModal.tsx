import { type FormEvent } from 'react';
import type { Item } from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type BorrowFormState = {
  fullName: string;
  quantity: string;
  returnDate: string;
  purpose: string;
  urgent: boolean;
};

type Props = {
  open: boolean;
  item: Item | null;
  form: BorrowFormState;
  onFormChange: (form: BorrowFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function BorrowModal({ open, item, form, onFormChange, onSubmit, onClose }: Props) {
  if (!item) return null;

  const isSubmitDisabled =
    !form.fullName.trim() ||
    !form.quantity ||
    !form.returnDate ||
    !form.purpose.trim();

  const primaryLabel = form.urgent ? 'Urgent Borrow' : 'Submit Request';
  const primaryButtonClasses = form.urgent
    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
    : 'bg-sky-500 hover:bg-sky-600 text-white';
  const urgentTrackClasses = form.urgent ? 'bg-sky-500' : 'bg-gray-200';

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => (isOpen ? undefined : onClose())}>
      <AlertDialogContent size="wide" className="p-0 w-full">
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <AlertDialogHeader className="space-y-3">
              <div className="w-1/2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-44 object-cover"
                />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">
                {item.name}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 text-center">
                {/* fill out the form to submit borrow request. */}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-800">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => onFormChange({ ...form, fullName: e.target.value })}
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-gray-800">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => onFormChange({ ...form, quantity: e.target.value })}
                    placeholder="Quantity"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-gray-800">Return Date</label>
                  <input
                    type="date"
                    value={form.returnDate}
                    onChange={(e) => onFormChange({ ...form, returnDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-800">Purpose</label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => onFormChange({ ...form, purpose: e.target.value })}
                  placeholder="Briefly describe how you will use this item"
                  className="w-full min-h-[96px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <span>Urgent Borrow?</span>
              <button
                type="button"
                onClick={() => onFormChange({ ...form, urgent: !form.urgent })}
                className={`h-6 w-12 rounded-full border border-gray-200 flex items-center px-1 transition-colors ${urgentTrackClasses}`}
                aria-pressed={form.urgent}
                aria-label="Toggle urgent borrow"
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    form.urgent ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <AlertDialogCancel
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </AlertDialogCancel>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${primaryButtonClasses} ${
                  isSubmitDisabled ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
