'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Import types and Step Components
import { AvailabilityStep } from '@/components/steps/AvailabilityStep'; // Adjust path
import { DocumentStep } from '@/components/steps/DocumentStep'; // Adjust path
import { ExamStep } from '@/components/steps/ExamStep'; // Adjust path
import type { DayAvailability, DayOfWeek, FormData, FormStep } from '@/types/form'; // Adjust path
import { ALL_DAYS } from '@/types/form'; // Adjust path
import { getChatCompletions } from '@/lib/openai';
import { convertDocxToText } from '@/lib/exportDocxToText';

// --- Step Definitions using Components ---
const formSteps: FormStep[] = [
  { id: 1, title: 'Select Availability', component: AvailabilityStep },
  { id: 2, title: 'Exam Information', component: ExamStep },
  { id: 3, title: 'Upload Document & Notes', component: DocumentStep },
];

// --- Helper to create initial availability state ---
const initializeAvailability = (): Record<DayOfWeek, DayAvailability> => {
  const initial: Partial<Record<DayOfWeek, DayAvailability>> = {};
  for (const day of ALL_DAYS) {
    // Initialize with empty start and end times
    initial[day] = { selected: false, startTime: '', endTime: '' };
  }
  return initial as Record<DayOfWeek, DayAvailability>;
};

// --- Main Component ---
export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Button state

  // Initialize state with the new availability structure
  const [formData, setFormData] = useState<FormData>({
    availability: initializeAvailability(),
    isExam: false,
    document: { file: null, text: '' },
    doneByTime: '',
  });

  // --- Calculated Values ---
  const totalSteps = formSteps.length;
  const progressValue = useMemo(
    () => ((currentStep + 1) / totalSteps) * 100,
    [currentStep, totalSteps]
  );
  const isLastStep = currentStep === totalSteps - 1;
  const ActiveStepComponent = formSteps[currentStep].component;

  // --- Handlers ---
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(); // Call submit on last step
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Form Submitted:', JSON.stringify(formData, null, 2)); // Pretty print
    alert('Form submitted! Check the console for the final data structure.');
    // TODO: Send data to your backend or perform desired action

    if (!formData.document.file) {
      console.error('No document file provided.');
      return;
    }

    if (formData.document.file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.error('Invalid file type. Please upload a .docx file.');
      return;
    }

    const fileText = await convertDocxToText(formData.document.file);

    await getChatCompletions(fileText + formData.document.text).then((response) => {
      console.log('ChatGPT Response:', response);
      alert('ChatGPT response received! Check the console for details.');
    });
  };

  // This function is passed down to children
  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  // --- Render Component ---
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>
            Step {currentStep + 1}: {formSteps[currentStep].title}
          </CardTitle>
          <span className="text-sm font-medium text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        {/* <CardDescription>Please fill out the details for this step.</CardDescription> */}
        <Progress value={progressValue} className="mt-1" />
      </CardHeader>
      <CardContent className="min-h-[300px] py-6">
        {/* Increased min-height and padding */}
        {/* Render the active step component */}
        <ActiveStepComponent
          formData={formData}
          updateFormData={updateFormData}
          setIsButtonDisabled={setIsButtonDisabled}
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={isButtonDisabled}>
          {isLastStep ? 'Submit Form' : 'Next Step'}
        </Button>
      </CardFooter>
    </Card>
  );
}
