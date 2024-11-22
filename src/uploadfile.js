import React, { useState } from "react";
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

import { storage } from './firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FileUploadDialog = ({ isOpen, onClose,onSubmit }) => {

  const [files, setFiles] = useState([]);

  const handleFilesChange = (newFiles) => {
    console.log('Files selected:', newFiles);
    if (Array.isArray(newFiles)) {
      setFiles(newFiles);
    } else {
      console.error('newFiles is not an array:', newFiles);
    }
  };

  const handleFileUploadSubmit = async () => {
    if (files.length > 0) {
      try {
        const urls = await Promise.all(
          files.map(async (file) => {
            const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('Uploaded file, downloadURL:', downloadURL);
            return downloadURL;
          })
        );
  
        console.log('Upload complete, URLs:', urls);
  
        if (typeof onSubmit === 'function') {
          onSubmit(urls);
        } else {
          console.error('onSubmit is not a function.');
        }
      } catch (error) {
        console.error('Error uploading files: ', error);
      }
    } else {
      onSubmit([]);
    }
  
    onClose();
  };

  

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
        </DialogHeader>
        <DialogBody>
            <FileUploadRoot maxW="xl" alignItems="stretch" maxFiles={10} onFilesChange={handleFilesChange}>
          
          <FileUploadDropzone
            label="Drag and drop here to upload"
            description=".png, .jpg up to 5MB"
          />
          <FileUploadList />
        </FileUploadRoot>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleFileUploadSubmit} colorScheme="teal">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default FileUploadDialog;
