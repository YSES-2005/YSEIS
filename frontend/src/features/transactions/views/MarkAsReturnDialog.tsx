import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

interface MarkAsReturnDialogProps {
  transactionId: string;
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkAsReturnDialog({
  transactionId,
  itemName,
  open,
  onOpenChange,
}: MarkAsReturnDialogProps) {
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast.error('Description is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/returns', {
        transaction: transactionId,
        description,
        condition: condition ? [condition] : [],
      });
      toast.success('Return marked successfully');
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Close dialog
      onOpenChange(false);
      // Reset form
      setDescription('');
      setCondition('');
    } catch (error) {
      console.error('Failed to mark as return:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark {itemName} as Returned</DialogTitle>
          <DialogDescription>
            Please provide details about the return process.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Required)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Returned on time, in good condition."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="condition">Condition (Optional)</Label>
            <Input
              id="condition"
              value={condition}
              onChange={e => setCondition(e.target.value)}
              placeholder="e.g. Good, Slightly used, Damaged"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Return'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
