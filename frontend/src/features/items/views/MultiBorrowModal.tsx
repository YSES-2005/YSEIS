import * as React from 'react';
import type {
  ItemPopulated as Item,
  MultiBorrowFormState,
} from '@schemas/itemSchema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
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
import { Plus, Minus } from 'lucide-react';

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
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    
    return () => {
        api.off('select', onSelect)
    }
  }, [api, setCurrentImageIndex]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <div className="mx-auto w-full max-w-[240px] flex flex-col items-center gap-4">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {availableItems.map((item) => (
                    <CarouselItem key={item.id}>
                      <div className="flex flex-col items-center gap-2">
  
                        <div className="aspect-square relative w-full overflow-hidden rounded-md border bg-muted">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <div className="text-center space-y-2">
                <DialogTitle>
                  {availableItems[currentImageIndex]?.name}
                </DialogTitle>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addItem(availableItems[currentImageIndex])}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                placeholder="Juan Dela Cruz"
                aria-invalid={!!errors.fullName}
              />
              <FieldError>{errors.fullName}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Selected Items</FieldLabel>
              <div className="flex flex-col gap-2">
                {form.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No items added yet.
                  </p>
                ) : (
                  form.items.map((entry) => {
                    const isQuantityInvalid =
                      entry.quantity < 1 ||
                      entry.quantity > entry.item.quantity;

                    return (
                      <Card
                        key={entry.item.id}
                        className="flex items-center justify-between p-3 shadow-none bg-muted/40"
                      >
                        <div className="grid gap-1">
                          <span className="font-medium text-sm">
                            {entry.item.name}
                          </span>
                          {isQuantityInvalid && (
                            <p className="text-[0.8rem] font-medium text-destructive">
                              {entry.quantity < 1
                                ? 'Min 1'
                                : `Max ${entry.item.quantity}`}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateItemQuantity(entry.item.id!, -1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-6 text-center text-sm font-medium">
                            {entry.quantity}
                          </span>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateItemQuantity(entry.item.id!, 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
              {errors.items && <FieldError>{errors.items}</FieldError>}
            </Field>

            {/* Return Date */}
            <Field>
              <FieldLabel htmlFor="returnDate">Return Date</FieldLabel>
              <Input
                id="returnDate"
                type="date"
                value={form.returnDate}
                onChange={(e) => setField('returnDate', e.target.value)}
                aria-invalid={!!errors.returnDate}
              />
              <FieldError>{errors.returnDate}</FieldError>
            </Field>

            {/* Purpose */}
            <Field>
              <FieldLabel htmlFor="purpose">Purpose</FieldLabel>
              <Textarea
                id="purpose"
                value={form.purpose}
                onChange={(e) => setField('purpose', e.target.value)}
                placeholder="Briefly describe how you will use this item"
                aria-invalid={!!errors.purpose}
              />
              <FieldError>{errors.purpose}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter className="flex-row items-center justify-between sm:justify-between">
            {/* Urgent Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                id="urgent-toggle"
                checked={form.urgent}
                onCheckedChange={(checked) => setField('urgent', checked)}
              />
              <label
                htmlFor="urgent-toggle"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Urgent Borrow?
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
