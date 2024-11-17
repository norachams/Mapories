import React from "react";
import {
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "./components/ui/file-button"



const FileUploadDialog = ({ isOpen, onClose }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
        </DialogHeader>
        <DialogBody>
            <FileUploadRoot maxW="xl" alignItems="stretch" maxFiles={10}>
          <FileUploadDropzone
            label="Drag and drop here to upload"
            description=".png, .jpg up to 5MB"
          />
          <FileUploadList />
        </FileUploadRoot>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onClose} colorScheme="teal">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default FileUploadDialog;
