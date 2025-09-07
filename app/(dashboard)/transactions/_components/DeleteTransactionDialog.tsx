"use client";

import { Category } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTransactions } from "../_actions/deleteTransaction";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionId: string;
}

const DeleteTransactionDialog = ({ open, setOpen, transactionId }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTransactions,
    onSuccess: async () => {
      toast.success("Transaction deleted successfully!", {
        id: transactionId,
      });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.success("Something went wrong!", {
        id: transactionId,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This acton can't be undone. This will permanently delete your
            transaction!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading(`Deleting transaction...`, { id: transactionId });
              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionDialog;
