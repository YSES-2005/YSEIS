import * as React from 'react';
import type {
  BorrowFormData,
  ItemPopulated as Item,
} from '@schemas/itemSchema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleFormSubmit} className="grid gap-6">
          <DialogHeader className="items-center">
            <div className="mb-4 w-full max-w-1/2 aspect-square relative overflow-hidden rounded-md border bg-muted">
              <img
                src={item.avatar}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Full Name */}
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

            {/* Quantity and Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={form.quantity}
                  onChange={e => setField('quantity', Number(e.target.value))}
                  placeholder="1"
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

            {/* Purpose */}
            <Field>
              <FieldLabel htmlFor="purpose">Purpose</FieldLabel>
              <Textarea
                id="purpose"
                value={form.purpose}
                onChange={e => setField('purpose', e.target.value)}
                placeholder="Briefly describe usage..."
                aria-invalid={!!errors.purpose}
              />
              <FieldError>{errors.purpose}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter className="flex-row items-center justify-between sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="urgent-toggle"
                checked={form.urgent}
                onCheckedChange={checked => setField('urgent', checked)}
              />
              <label
                htmlFor="urgent-toggle"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Urgent?
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant={form.urgent ? 'destructive' : 'default'}
              >
                {form.urgent ? 'Urgent Borrow' : 'Submit'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
