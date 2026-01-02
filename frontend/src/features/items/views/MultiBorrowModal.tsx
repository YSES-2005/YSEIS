import type {
  ItemPopulated as Item,
  MultiBorrowFormState,
} from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { FormField, TextInput, TextArea } from '@/components/ui/form-field';

type Props = {
  open: boolean;
  availableItems: Item[];
  form: MultiBorrowFormState;
  errors: Partial<Record<keyof MultiBorrowFormState, string>>;
  currentImageIndex: number;
  onSubmit: () => void;
  onClose: () => void;
  setField: <K extends keyof MultiBorrowFormState>(
    field: K,
    value: MultiBorrowFormState[K]
  ) => void;
  addItem: (item: Item) => void;
  updateItemQuantity: (itemId: string, delta: number) => void;
  setCurrentImageIndex: (index: number) => void;
};

export function MultiBorrowModal({
  open,
  availableItems,
  form,
  errors,
  currentImageIndex,
  onSubmit,
  onClose,
  setField,
  addItem,
  updateItemQuantity,
  setCurrentImageIndex,
}: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={isOpen => (isOpen ? undefined : onClose())}
    >
      <AlertDialogContent size="wide" className="p-0 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <AlertDialogHeader className="space-y-3">
              <div className="relative w-full overflow-hidden rounded-lg border border-input bg-muted">
                <img
                  src={availableItems[currentImageIndex]?.avatar}
                  alt={availableItems[currentImageIndex]?.name}
                  className="w-full h-44 object-cover"
                />
                {availableItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                      }
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 disabled:opacity-30"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex(
                          Math.min(
                            availableItems.length - 1,
                            currentImageIndex + 1
                          )
                        )
                      }
                      disabled={currentImageIndex === availableItems.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 disabled:opacity-30"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {availableItems.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-muted'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-foreground text-center">
                {availableItems[currentImageIndex]?.name}
              </AlertDialogTitle>
              <button
                type="button"
                onClick={() => addItem(availableItems[currentImageIndex])}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-opacity mx-auto bg-primary text-primary-foreground hover:opacity-90"
              >
                Add item
              </button>
            </AlertDialogHeader>

            <div className="grid gap-3">
              <FormField label="Full Name" error={errors.fullName}>
                <TextInput
                  type="text"
                  value={form.fullName}
                  onChange={e => setField('fullName', e.target.value)}
                  placeholder="Juan Dela Cruz"
                  error={errors.fullName}
                />
              </FormField>

              <div className="grid gap-1">
                <label className="text-sm font-semibold text-foreground">
                  Items
                </label>
                <div className="space-y-2">
                  {form.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">
                      No items added yet. Add items from the carousel above.
                    </p>
                  ) : (
                    form.items.map(
                      (entry: {
                        item: { id?: string; name: string; quantity: number };
                        quantity: number;
                      }) => {
                        const itemId = entry.item.id!;
                        const isQuantityInvalid =
                          entry.quantity < 1 ||
                          entry.quantity > entry.item.quantity;
                        return (
                          <div
                            key={itemId}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground">
                                {entry.item.name}
                              </span>
                              {isQuantityInvalid && (
                                <span className="text-xs text-destructive">
                                  {entry.quantity < 1
                                    ? 'Quantity must be at least 1'
                                    : `Max ${entry.item.quantity} available`}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(itemId, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-destructive text-destructive-foreground text-lg font-bold hover:opacity-90 transition-opacity"
                              >
                                −
                              </button>
                              <span
                                className={`w-8 text-center text-sm font-semibold ${isQuantityInvalid ? 'text-destructive' : ''}`}
                              >
                                {entry.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(itemId, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-success text-success-foreground text-lg font-bold hover:opacity-90 transition-opacity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
                {errors.items && (
                  <p className="text-xs text-red-500 mt-1">{errors.items}</p>
                )}
              </div>

              <FormField label="Return Date" error={errors.returnDate}>
                <TextInput
                  type="date"
                  value={form.returnDate}
                  onChange={e => setField('returnDate', e.target.value)}
                  error={errors.returnDate}
                />
              </FormField>

              <FormField label="Purpose" error={errors.purpose}>
                <TextArea
                  value={form.purpose}
                  onChange={e => setField('purpose', e.target.value)}
                  placeholder="Briefly describe how you will use this item"
                  error={errors.purpose}
                />
              </FormField>
            </div>
          </div>

          <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span>Urgent Borrow?</span>
              <button
                type="button"
                onClick={() => setField('urgent', !form.urgent)}
                className="h-6 w-12 rounded-full border border-input flex items-center px-1 transition-colors"
                style={{
                  backgroundColor: form.urgent
                    ? 'var(--primary)'
                    : 'var(--muted)',
                }}
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
                className="px-4 py-2 rounded-lg border border-input text-foreground hover:bg-muted"
                onClick={onClose}
              >
                Cancel
              </AlertDialogCancel>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 ${
                  form.urgent
                    ? 'bg-warning text-warning-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
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
