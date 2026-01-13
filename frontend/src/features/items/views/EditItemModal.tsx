import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import useUsersViewModel from '../viewmodels/useUsersViewModel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Item, ItemUpdate } from '@schemas/itemSchema';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  form: ItemUpdate;
  errors: Partial<Record<keyof Item, string>>;
  isCreating: boolean;
  onSubmit: () => void;
  onClose: () => void;
  setField: <K extends keyof ItemUpdate>(
    field: K,
    value: ItemUpdate[K]
  ) => void;
};

export function EditItemModal({
  open,
  form,
  errors,
  isCreating,
  onSubmit,
  onClose,
  setField,
}: Props) {
  const { options, isLoading } = useUsersViewModel();
  console.log(options);
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  if (!form.name) return null;

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleFormSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Item
            </DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="avatar"> Avatar (WIP) </FieldLabel>
              <Input
                id="avatar"
                type="text"
                placeholder="Item avatar"
                value={form.avatar}
                onChange={e => setField('avatar', e.target.value)}
                aria-invalid={!!errors.avatar}
              />
              <FieldError>{errors.avatar}</FieldError>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name"> Name </FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Item Name"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                aria-invalid={!!errors.name}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="custodian"> Custodian </FieldLabel>
              <Combobox
                items={options}
                value={form.custodian}
                onValueChange={val => {
                  console.log(val);
                  setField(
                    'custodian' as any,
                    val === '' ? undefined : (val as any)
                  );
                }}
              >
                <ComboboxInput
                  id="custodian"
                  placeholder={
                    isLoading ? 'Loading users...' : 'Select a custodian'
                  }
                  value={
                    form.custodian
                      ? options.find(o => o.value === form.custodian)?.label
                      : 'Select a custodian'
                  }
                  showClear
                  disabled={isLoading}
                  className="w-[200px]"
                />
                <ComboboxContent>
                  <ComboboxEmpty>
                    {isLoading ? 'Loading users...' : 'No users found.'}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {opt => (
                      <ComboboxItem
                        key={(opt as any).value}
                        value={(opt as any).value}
                      >
                        {(opt as any).label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError>{errors.custodian}</FieldError>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="location"> Location </FieldLabel>
              <Input
                id="location"
                type="text"
                placeholder="Item location"
                value={form.location}
                onChange={e => setField('location', e.target.value)}
                aria-invalid={!!errors.location}
              />
              <FieldError>{errors.location}</FieldError>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="type"> Type </FieldLabel>
                <Select
                  value={form.type}
                  onValueChange={value => setField('type', value ?? 'Property')}
                >
                  <SelectTrigger aria-invalid={!!errors.type}>
                    <SelectValue>
                      {form.type ? form.type : 'Select a type'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Property">Property</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{errors.type}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                <Input
                  id="quantity"
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={e => setField('quantity', Number(e.target.value))}
                  placeholder="0"
                  aria-invalid={!!errors.quantity}
                />
                <FieldError>{errors.quantity}</FieldError>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? <Spinner /> : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
