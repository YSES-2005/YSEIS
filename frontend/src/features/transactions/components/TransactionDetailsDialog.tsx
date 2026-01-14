import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";
import { type Transaction } from './columns';
import { X } from 'lucide-react';

interface TransactionDetailsDialogProps {
    transaction: Transaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
    transaction,
    open,
    onOpenChange,
}: TransactionDetailsDialogProps) {
    if (!transaction) return null;

    const { item, borrower, quantity, returnDate, purpose } = transaction;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white">
                <div className="absolute right-4 top-4 z-10">
                    <DialogClose className="rounded-full bg-white p-1 hover:bg-gray-100 transition-colors">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left Side: Image */}
                    <div className="md:w-1/2 p-6 flex flex-col justify-center items-center bg-gray-50/50">
                        <div className="bg-white p-2 rounded-xl shadow-sm w-full aspect-[4/3]">
                            <img
                                src={item.avatar || 'https://placehold.co/600x400'}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="md:w-1/2 p-8 pt-12 space-y-5">

                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm md:text-base">
                            <span className="text-muted-foreground font-medium">Item:</span>
                            <span className="font-semibold text-gray-900">{item.name}</span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm md:text-base">
                            <span className="text-muted-foreground font-medium">Borrower:</span>
                            <span className="font-semibold text-gray-900">{borrower.name}</span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm md:text-base">
                            <span className="text-muted-foreground font-medium">Quantity:</span>
                            <span className="font-semibold text-gray-900">{quantity}</span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm md:text-base">
                            <span className="text-muted-foreground font-medium">Return Date:</span>
                            <span className="font-semibold text-gray-900">
                                {new Date(returnDate).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm md:text-base">
                            <span className="text-muted-foreground font-medium">Purpose:</span>
                            <span className="font-semibold text-gray-900">{purpose}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
