// Modal.tsx
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ReusableModalProps> = ({ isOpen, onClose, title, description, children }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>Título</DialogTrigger>
            <DialogContent className="bg-white">
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
                <div className="modal-content">{children}</div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
