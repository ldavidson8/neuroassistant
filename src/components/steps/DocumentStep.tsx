// src/components/steps/DocumentStep.tsx
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Only needed for the hidden input
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Image as ImageIcon } from "lucide-react"; // More icons
import type { StepProps } from "@/types/form"; // Adjust path

// Define allowed file types (adjust as needed)
// const ALLOWED_IMAGE_TYPES = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "image/webp",
// ];
// Example for more types: const ALLOWED_TYPES = ['image/*', 'application/pdf'];

export const DocumentStep: React.FC<StepProps> = ({
    formData,
    updateFormData,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // More robust validation
            // if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            //     alert(
            //         `Invalid file type. Please upload one of: ${ALLOWED_IMAGE_TYPES.map(
            //             (t) => t.split("/")[1]
            //         ).join(", ")}`
            //     );
            //     // Reset file input
            //     if (fileInputRef.current) {
            //         fileInputRef.current.value = "";
            //     }
            //     return;
            // }
            // Optional size limit (e.g., 5MB)
            // if (file.size > 5 * 1024 * 1024) {
            //   alert("File size exceeds 5MB limit.");
            //   if (fileInputRef.current) fileInputRef.current.value = "";
            //   return;
            // }

            updateFormData("document", { ...formData.document, file: file });
        } else {
            // Handle case where user cancels file selection (optional)
            // updateFormData("document", { ...formData.document, file: null });
        }
    };

    const handleTextChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        updateFormData("document", {
            ...formData.document,
            text: event.target.value,
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const getFileTypeIcon = (file: File | null) => {
        if (!file) return <Upload className='mr-2 h-4 w-4' />;
        if (file.type.startsWith("image/"))
            return <ImageIcon className='mr-2 h-4 w-4' />;
        // Add more icons based on type if needed
        return <FileText className='mr-2 h-4 w-4' />;
    };

    return (
        <div className='space-y-6'>
            {/* Hidden File Input */}
            <Input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
                // accept={ALLOWED_IMAGE_TYPES.join(",")} // Set accepted types dynamically
            />

            {/* File Upload Area */}
            <div>
                <Label className='text-base font-medium'>
                    Upload Document/Image
                </Label>
                <p className='text-sm text-muted-foreground mb-3'>
                    Attach a relevant image (PNG, JPG, GIF, WEBP).
                </p>
                <Button
                    variant='outline'
                    onClick={triggerFileInput}
                    className='w-full justify-start text-left h-auto py-3' // Make button taller for better display
                >
                    <div className='flex items-center'>
                        {getFileTypeIcon(formData.document.file)}
                        <div className='flex flex-col'>
                            <span className='font-medium'>
                                {formData.document.file
                                    ? formData.document.file.name
                                    : "Click to upload"}
                            </span>
                            {formData.document.file && (
                                <span className='text-xs text-muted-foreground'>
                                    Type: {formData.document.file.type}, Size:{" "}
                                    {(
                                        formData.document.file.size / 1024
                                    ).toFixed(1)}{" "}
                                    KB
                                </span>
                            )}
                            {!formData.document.file && (
                                <span className='text-xs text-muted-foreground'>
                                    Max 5MB.
                                </span>
                            )}
                        </div>
                    </div>
                </Button>
            </div>

            {/* Text Input */}
            <div>
                <Label
                    htmlFor='documentText'
                    className='text-base font-medium'
                >
                    Paste Content / Notes
                </Label>
                <p className='text-sm text-muted-foreground mb-3'>
                    Add any relevant text, links, or notes below.
                </p>
                <Textarea
                    id='documentText'
                    placeholder='Paste or type here...'
                    value={formData.document.text}
                    onChange={handleTextChange}
                    rows={8} // Increased rows
                    className='mt-1'
                />
            </div>
        </div>
    );
};
