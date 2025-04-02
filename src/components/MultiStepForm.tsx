'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Import types and Step Components
import { AvailabilityStep } from '@/components/steps/AvailabilityStep'; // Adjust path
import { DocumentStep } from '@/components/steps/DocumentStep'; // Adjust path
import { ExamStep } from '@/components/steps/ExamStep'; // Adjust path
import type { DayAvailability, DayOfWeek, FormData, FormStep } from '@/types/form'; // Adjust path - *** Added TimetableEvent ***
import type { TimetableEvent } from '@/types/calendar'; // Adjust path - *** Added TimetableEvent ***
import { ALL_DAYS } from '@/types/form'; // Adjust path
import { getChatCompletions } from '@/lib/openai';
import { convertDocxToText } from '@/lib/exportDocxToText';

// Import the PlanCalendar component
import PlanCalendar from '@/components/calendar/PlanCalendar';

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
  const [isLoading, setIsLoading] = useState(false); // Loading state for API call
  const [apiError, setApiError] = useState<string | null>(null); // Error state for API call

  // Initialize state with the new availability structure
  const [formData, setFormData] = useState<FormData>({
    availability: initializeAvailability(),
    isExam: false,
    document: { file: null, text: '' },
    doneByTime: '',
  });

  // *** State to hold the timetable data from the API ***
  const [timetableData, setTimetableData] = useState<TimetableEvent[] | null>(null);

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
      // Reset timetable data if going back from the results view
      setTimetableData(null);
      setApiError(null);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Form Submitted:', JSON.stringify(formData, null, 2)); // Pretty print
    // Clear previous results and errors
    setTimetableData(null);
    setApiError(null);
    setIsLoading(true); // Start loading indicator
    setIsButtonDisabled(true); // Disable submit button during API call

    if (!formData.document.file) {
      console.error('No document file provided.');
      setApiError('No document file provided.');
      setIsLoading(false);
      setIsButtonDisabled(false); // Re-enable button on error
      return;
    }

    if (
      formData.document.file.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      console.error('Invalid file type. Please upload a .docx file.');
      setApiError('Invalid file type. Please upload a .docx file.');
      setIsLoading(false);
      setIsButtonDisabled(false); // Re-enable button on error
      return;
    }

    try {
      const fileText = await convertDocxToText(formData.document.file);
      const fullInputText = fileText + '\n\n---\n\nNotes:\n' + formData.document.text; // Combine doc text and notes

      // --- Call OpenAI API ---
      const response = await getChatCompletions(fullInputText); // Assuming this returns the JSON string directly or within a known structure
      console.log('Raw ChatGPT Response:', response);

      // --- Process the response ---
      // Assuming the response is the string containing ```json ... ```
      // You might need to adjust this based on the actual structure of `response`
      let jsonString = response;
      if (typeof response === 'string') {
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/); // Extract JSON from markdown code block
        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1];
        } else {
          // Handle cases where the response might be just the JSON string without backticks
          try {
            JSON.parse(response); // Check if it's valid JSON already
            jsonString = response;
          } catch (e) {
            throw new Error('Could not find valid JSON in the API response.');
          }
        }
      } else {
        // If the API returns an object directly
        jsonString = JSON.stringify(response);
      }

      const parsedTimetable: TimetableEvent[] = JSON.parse(jsonString);
      console.log('Parsed Timetable Data:', parsedTimetable);

      // --- Update state with the fetched data ---
      setTimetableData(parsedTimetable);
      alert('Timetable generated successfully! See the calendar below.');
    } catch (error) {
      console.error('Error during submission or fetching timetable:', error);
      setApiError(
        `Failed to generate timetable. ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      alert(`Error: ${apiError}`); // Show error to user
    } finally {
      setIsLoading(false); // Stop loading indicator
      // Keep the submit button disabled after successful submission to prevent resubmission
      // Or re-enable it if you want users to be able to submit again:
      // setIsButtonDisabled(false);
    }
  };

  // This function is passed down to children
  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // --- Render Component ---
  return (
    <>
      {' '}
      {/* Use Fragment to return multiple elements */}
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
          <Progress value={progressValue} className="mt-1" />
        </CardHeader>
        <CardContent className="min-h-[300px] py-6">
          {/* Render the active step component */}
          <ActiveStepComponent
            formData={formData}
            updateFormData={updateFormData}
            setIsButtonDisabled={setIsButtonDisabled} // Pass down button disabling setter
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0 || isLoading}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isButtonDisabled || isLoading}>
            {isLoading ? 'Generating...' : isLastStep ? 'Generate Timetable' : 'Next Step'}
          </Button>
        </CardFooter>
      </Card>
      {/* --- Conditionally Render the Calendar --- */}
      {isLoading && <div className="text-center mt-4">Loading Timetable...</div>}
      {apiError && <div className="text-center text-red-600 mt-4">Error: {apiError}</div>}
      {timetableData &&
        !isLoading &&
        !apiError && ( // Only render if data exists, not loading, and no error
          <div className="mt-8">
            {' '}
            {/* Add some margin */}
            <h2 className="text-xl font-semibold mb-4 text-center">Generated Timetable</h2>
            <PlanCalendar timetable={timetableData} />
          </div>
        )}
    </>
  );
}
