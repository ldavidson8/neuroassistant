// src/components/steps/ExamStep.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { StepProps } from "@/types/form"; // Adjust path

export const ExamStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
    return (
        <div className='flex items-center space-x-3 rounded-md border p-4'>
            <Switch
                id='isExam'
                checked={formData.isExam}
                onCheckedChange={(checked) => updateFormData("isExam", checked)}
            />
            <Label
                htmlFor='isExam'
                className='flex flex-col space-y-1'
            >
                <span>Exam Related</span>
                <span className='font-normal leading-snug text-muted-foreground'>
                    Enable if this content relates to an exam (may trigger
                    related questions later).
                </span>
            </Label>
        </div>
    );
};
