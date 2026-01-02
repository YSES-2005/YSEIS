import type {
  BorrowFormData,
  ItemPopulated as Item,
} from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { FormField, TextInput, TextArea } from '@/components/ui/form-field';

type Props = {
  open: boolean;
  item: Item | null;
  form: BorrowFormData;
  errors: Partial<Record<keyof BorrowFormData, string>>;
  onSubmit: () => void;
  onClose: () => void;
  setField: <K extends keyof BorrowFormData>(
    field: K,
    value: BorrowFormData[K]
  ) => void;
};

export function BorrowModal({
  open,
  item,
  form,
  errors,
  onSubmit,
  onClose,
  setField,
}: Props) {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  if (!item) return null;

  const primaryLabel = form.urgent ? 'Urgent Borrow' : 'Submit Request';
  const urgentTrackClasses = form.urgent ? '' : 'bg-gray-200';
  const urgentTrackStyle = form.urgent
    ? { backgroundColor: 'var(--primary)' }
    : undefined;

  return (
    <AlertDialog
      open={open}
      onOpenChange={isOpen => (isOpen ? undefined : onClose())}
    >
      <AlertDialogContent size="wide" className="p-0 w-full">
        <form onSubmit={handleFormSubmit} className="flex flex-col">
          <div className="p-5 space-y-4">
            <AlertDialogHeader className="space-y-3">
              <div className="w-1/2 overflow-hidden rounded-lg border border-input bg-muted">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-44 object-cover"
                />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-foreground text-center">
                {item.name}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground text-center" />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Quantity" error={errors.quantity}>
                  <TextInput
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={e => setField('quantity', Number(e.target.value))}
                    placeholder="Quantity"
                    error={errors.quantity}
                  />
                </FormField>
                <FormField label="Return Date" error={errors.returnDate}>
                  <TextInput
                    type="date"
                    value={form.returnDate}
                    onChange={e => setField('returnDate', e.target.value)}
                    error={errors.returnDate}
                  />
                </FormField>
              </div>

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
                className={`h-6 w-12 rounded-full border border-input flex items-center px-1 transition-colors ${urgentTrackClasses}`}
                style={urgentTrackStyle}
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
                {primaryLabel}
              </button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
