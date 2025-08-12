import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/components/ui/use-toast';
import { usePlatforms } from '../contexts/PlatformContext';

interface AddPlatformDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlatformDialog = ({ isOpen, onClose }: AddPlatformDialogProps) => {
  const [name, setName] = useState('');
  const { addPlatform } = usePlatforms();
  const { toast } = useToast();

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast({
        variant: 'destructive',
        description: 'Platform name cannot be empty',
      });
      return;
    }
    await addPlatform(trimmed);
    toast({ description: 'Platform added successfully' });
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Platform</DialogTitle>
          <DialogDescription>Enter the name of the new platform or gig.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input
              id="platform-name"
              placeholder="e.g., TaskRabbit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlatformDialog;
