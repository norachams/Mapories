import React from "react";
import { Button } from "./components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "./components/ui/menu";
import { Box } from "@chakra-ui/react";

const FloatingMenu = () => {
  return (
    <Box
      position="fixed"
      top="15px"
      left="20px"
      bg="white"
      height="45px"
      p={2}
      borderRadius="md"
      shadow="md"
      zIndex="1000"
      fontSize="30px"
    >
      <MenuRoot>
        <MenuTrigger asChild>
          <Button size="sm" top="-15px">☰</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="countries-visited">Countries Visited</MenuItem>
          <MenuItem value="add-photos">Add Photos</MenuItem>
          <MenuItem value="settings">Settings</MenuItem>
          <MenuItem value="help">Help</MenuItem>
          {/* Add more menu items as needed */}
        </MenuContent>
      </MenuRoot>
    </Box>
  );
};

export default FloatingMenu;
