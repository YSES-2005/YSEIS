import type {
  ItemPopulated as Item,
  MultiBorrowFormState,
} from '@schemas/itemSchema';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

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
      <AlertDialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AlertDialogHeader className="text-center place-items-center">
            <div className="relative w-full overflow-hidden rounded-lg border border-input bg-muted mx-auto h-44">
              <img
                src={availableItems[currentImageIndex]?.avatar}
                alt={availableItems[currentImageIndex]?.name}
                className="w-full h-full object-cover"
              />

              {availableItems.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() =>
                      setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                    }
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                  >
                    <ChevronLeft />
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() =>
                      setCurrentImageIndex(
                        Math.min(
                          availableItems.length - 1,

                          currentImageIndex + 1
                        )
                      )
                    }
                    disabled={currentImageIndex === availableItems.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                  >
                    <ChevronRight />
                  </Button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {availableItems.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`size-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <AlertDialogTitle className="w-full text-center">
              {availableItems[currentImageIndex]?.name}
            </AlertDialogTitle>

            <div className="col-span-full flex w-full justify-center">
              <Button
                type="button"
                size="sm"
                onClick={() => addItem(availableItems[currentImageIndex])}
              >
                Add item
              </Button>
            </div>
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

            <Field>
              <FieldLabel>Items</FieldLabel>

              <div className="flex flex-col gap-2">
                {form.items.length === 0 ? (
                  <p className="text-muted-foreground py-2">
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
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex flex-col">
                            <span className="text-foreground">
                              {entry.item.name}
                            </span>

                            {isQuantityInvalid && (
                              <span className="text-destructive">
                                {entry.quantity < 1
                                  ? 'Quantity must be at least 1'
                                  : `Max ${entry.item.quantity} available`}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon-xs"
                              onClick={() => updateItemQuantity(itemId, -1)}
                            >
                              <Minus />
                            </Button>

                            <span
                              className={`w-8 text-center font-semibold ${isQuantityInvalid ? 'text-destructive' : ''}`}
                            >
                              {entry.quantity}
                            </span>

                            <Button
                              type="button"
                              variant="default"
                              size="icon-xs"
                              onClick={() => updateItemQuantity(itemId, 1)}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>

              {errors.items && <FieldError>{errors.items}</FieldError>}
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

          <AlertDialogFooter className="flex flex-wrap items-center gap-3 sm:justify-between">
            <Field orientation="horizontal" className="w-auto">
              <Switch
                id="urgent-toggle"
                checked={form.urgent}
                onCheckedChange={checked => setField('urgent', checked)}
                aria-label="Toggle urgent borrow"
              />

              <FieldLabel
                htmlFor="urgent-toggle"
                className="font-normal cursor-pointer"
              >
                Urgent Borrow?
              </FieldLabel>
            </Field>

            <div className="flex items-center gap-2 ml-auto">
              <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>

              <Button
                type="submit"
                variant={form.urgent ? 'destructive' : 'default'}
              >
                {form.urgent ? 'Urgent Borrow' : 'Submit Request'}
              </Button>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
