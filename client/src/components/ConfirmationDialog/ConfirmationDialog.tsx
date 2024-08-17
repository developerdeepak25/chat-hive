import  { useState } from "react";
import {  useBlocker } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmationDialogProps ={
    triggerValue: boolean
    message: string
}


const ConfirmationDialog = ({triggerValue,message}:ConfirmationDialogProps) => {
//   const [isDirty, setIsDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (triggerValue && currentLocation.pathname !== nextLocation.pathname) {
      setShowDialog(true);
      return true;
    }
    return false;
  });

 

  const handleConfirm = () => {
    blocker?.proceed?.();
    setShowDialog(false);
  };

  const handleCancel = () => {
    blocker?.reset?.();
    setShowDialog(false);
  };

  return (
    <div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{message}</AlertDialogTitle>
            {/* <AlertDialogDescription>
             {message}
            </AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfirmationDialog;
