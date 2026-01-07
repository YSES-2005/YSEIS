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
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

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

  return (
    <AlertDialog
      open={open}
      onOpenChange={isOpen => (isOpen ? undefined : onClose())}
    >
      <AlertDialogContent>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <AlertDialogHeader className="sm:text-center sm:plafwce-items-center">
            <div className="w-1/2 overflow-hidden rounded-lg mx-auto">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-full h-44 object-cover"
              />
            </div>
            <AlertDialogTitle className="w-full text-center">
              {item.name}
            </AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={e => setField('fullName', e.target.value)}
                placeholder="Juan Dela Cruz"
                aria-invalid={!!errors.fullName}
              />
              <FieldError>{errors.fullName}</FieldError>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={e => setField('quantity', Number(e.target.value))}
                  placeholder="Quantity"
                  aria-invalid={!!errors.quantity}
                />
                <FieldError>{errors.quantity}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="returnDate">Return Date</FieldLabel>
                <Input
                  id="returnDate"
                  type="date"
                  value={form.returnDate}
                  onChange={e => setField('returnDate', e.target.value)}
                  aria-invalid={!!errors.returnDate}
                />
                <FieldError>{errors.returnDate}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="purpose">Purpose</FieldLabel>
              <Textarea
                id="purpose"
                value={form.purpose}
                onChange={e => setField('purpose', e.target.value)}
                placeholder="Briefly describe how you will use this item"
                aria-invalid={!!errors.purpose}
              />
              <FieldError>{errors.purpose}</FieldError>
            </Field>
          </FieldGroup>

          <AlertDialogFooter>
            <Field orientation="horizontal" className="w-auto">
              <Switch
                id="urgent-toggle"
                checked={form.urgent}
                onCheckedChange={(checked) => setField('urgent', checked)}
                aria-label="Toggle urgent borrow"
              />
               <FieldLabel htmlFor="urgent-toggle" className="font-normal cursor-pointer">Urgent Borrow?</FieldLabel>
            </Field>

            <div className="flex items-center gap-2 ml-auto">
              <AlertDialogCancel onClick={onClose}>
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                variant={form.urgent ? "destructive" : "default"}
              >
                {primaryLabel}
              </Button>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
