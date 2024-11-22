import React, { useState, useEffect } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const PhotoGalleryDialog = ({ isOpen, onClose, marker, onDeletePhoto, onAddPhotos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    console.log('Marker photos:', marker.photos);
    setCurrentPhotoIndex(0);
  }, [marker]);
  

  
  if (!marker) {
    return null;
  }

  const totalPhotos = marker.photos ? marker.photos.length : 0;

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? totalPhotos - 1 : prevIndex - 1
    );
  };

  const handleDeletePhoto = () => {
    onDeletePhoto(marker, currentPhotoIndex);
    setCurrentPhotoIndex(0);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle fontWeight={800} fontSize={"16px"}>{marker.name}</DialogTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            position="absolute"
            top="8px"
            right="8px"
          >
            <FaTimes />
          </Button>
        </DialogHeader>
        <DialogBody>
        {totalPhotos > 0 && marker.photos[currentPhotoIndex] ? (
          <div style={{ textAlign: "center" }}>
            <img
              src={marker.photos[currentPhotoIndex]}
              alt={`${currentPhotoIndex + 1}`}
              style={{ maxWidth: "100%", maxHeight: "60vh" }}
            />
            {/* Navigation buttons */}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p>No photos added yet.</p>
          </div>
        )}
      </DialogBody>
        <DialogFooter>
          {totalPhotos > 0 && (
            <Button onClick={handleDeletePhoto} colorScheme="red">
              Delete Photo
            </Button>
          )}
          <Button onClick={() => onAddPhotos(marker)} backgroundColor="teal" color="white" padding="8px">
            Add Photos
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default PhotoGalleryDialog;
