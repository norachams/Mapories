import React, { useState } from "react";
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
import FileUploadDialog from "./uploadfile"


const ConfirmationDialog = ({ isOpen, onClose, onConfirm, cityName }) => {
  
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const handleAddPhotos = () => {
    onConfirm();
    setIsFileUploadOpen(true); 
    onClose(); 
  };

  return (
    <>
      {/* Confirmation Dialog */}
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader/>
        <DialogBody>
          <p>Did you visit {cityName} and want to add to your visited list?</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={onConfirm} backgroundColor="#EEEE" padding="12px" >
              Yes
            </Button>
          </DialogActionTrigger>
          <Button onClick={handleAddPhotos} backgroundColor="teal" color="white" padding="8px" >
              Yes, Add Photos
            </Button>
          <Button onClick={onClose} colorScheme="teal">
            Cancel
          </Button>
        </DialogFooter>
        <DialogCloseTrigger/>
      </DialogContent>
    </DialogRoot>

    {/* File Upload Dialog */}
    <FileUploadDialog
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
      />
    </>
  );
};

export default ConfirmationDialog;
