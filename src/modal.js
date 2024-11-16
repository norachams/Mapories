import React from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, cityName }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm You Visited {cityName}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>Did you visit {cityName} and want to add to your visited list?</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={onConfirm} variant="outline">
              Yes
            </Button>
          </DialogActionTrigger>
          <Button onClick={onClose} variant="outline">
              Add Photos
            </Button>
          <Button onClick={onClose} colorScheme="teal">
            Cancel
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmationDialog;
