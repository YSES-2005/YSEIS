import { type FormEvent } from 'react';
import type { Item } from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type MultiBorrowFormState = {
  fullName: string;
  items: { item: Item; quantity: number }[];
  returnDate: string;
  purpose: string;
  urgent: boolean;
};

type Props = {
  open: boolean;
  availableItems: Item[];
  form: MultiBorrowFormState;
  currentImageIndex: number;
  onFormChange: (form: MultiBorrowFormState) => void;
  onImageIndexChange: (index: number) => void;
  onAddItem: (item: Item) => void;
  onUpdateItemQuantity: (itemId: string, delta: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function MultiBorrowModal({
  open,
  availableItems,
  form,
  currentImageIndex,
  onFormChange,
  onImageIndexChange,
  onAddItem,
  onUpdateItemQuantity,
  onSubmit,
  onClose,
}: Props) {
  const isMultiBorrowDisabled =
    !form.fullName.trim() ||
    !form.returnDate ||
    !form.purpose.trim() ||
    form.items.length === 0;

  const displayItems = form.items.length > 0 ? form.items.map(i => i.item) : availableItems;
  const currentItem = displayItems[currentImageIndex];

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => (isOpen ? undefined : onClose())}>
      <AlertDialogContent size="wide" className="p-0 w-full">
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <AlertDialogHeader className="space-y-3">
              <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={currentItem?.avatar}
                  alt={currentItem?.name}
                  className="w-full h-44 object-cover"
                />
                {displayItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => onImageIndexChange(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onImageIndexChange(Math.min(displayItems.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === displayItems.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {displayItems.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onImageIndexChange(idx)}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex ? 'bg-sky-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">
                {currentItem?.name}
              </AlertDialogTitle>
              <button
                type="button"
                onClick={() => {
                  const item = availableItems[currentImageIndex];
                  if (item) {
                    onAddItem(item);
                  }
                }}
                className="px-4 py-1.5 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors mx-auto"
              >
                Add item
              </button>
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

              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-800">Quantity</label>
                <div className="space-y-2">
                  {form.items.map((entry) => {
                    const itemId = (entry.item as any).id || (entry.item as any)._id;
                    return (
                      <div key={itemId} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{entry.item.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateItemQuantity(itemId, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-red-400 hover:bg-red-500 text-white text-lg font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{entry.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateItemQuantity(itemId, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-green-400 hover:bg-green-500 text-white text-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                className={`h-6 w-12 rounded-full border border-gray-200 flex items-center px-1 transition-colors ${
                  form.urgent ? 'bg-sky-500' : 'bg-gray-200'
                }`}
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
                disabled={isMultiBorrowDisabled}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  form.urgent
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                } ${isMultiBorrowDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {form.urgent ? 'Urgent Borrow' : 'Submit Request'}
              </button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
