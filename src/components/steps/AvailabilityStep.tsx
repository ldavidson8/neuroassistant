// src/components/steps/AvailabilityStep.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import type { StepProps, DayOfWeek, DayAvailability } from '@/types/form'; // Adjust path
import { ALL_DAYS } from '@/types/form'; // Adjust path

// DayAvailabilityInput component remains the same...
const DayAvailabilityInput: React.FC<{
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}> = ({ day, startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  return (
    <div className="flex flex-col space-y-2 w-full border-b p-4 rounded-md">
      <Label className="text-sm font-medium capitalize">{day}</Label>
      <div className="flex space-x-2">
        <Input
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          placeholder="Start Time"
          aria-label={`${day} start time`} // Added aria-label for better accessibility
        />
        <Input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          placeholder="End Time"
          aria-label={`${day} end time`} // Added aria-label for better accessibility
        />
      </div>
    </div>
  );
};

export const AvailabilityStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  setIsButtonDisabled, // Note: This prop isn't currently used for validation here
}) => {
  const handleDayToggle = (day: DayOfWeek, isPressed: boolean) => {
    const currentAvailability = formData.availability;
    const updatedDayData: DayAvailability = {
      ...currentAvailability[day],
      selected: isPressed,
      startTime: isPressed ? currentAvailability[day].startTime : '',
      endTime: isPressed ? currentAvailability[day].endTime : '',
    };

    updateFormData('availability', {
      ...currentAvailability,
      [day]: updatedDayData,
    });
  };

  const handleTimeChange = (day: DayOfWeek, type: 'startTime' | 'endTime', time: string) => {
    const currentAvailability = formData.availability;
    const dayData = currentAvailability[day];
    updateFormData('availability', {
      ...currentAvailability,
      [day]: { ...dayData, [type]: time },
    });
  };

  // --- Handler for the new "Done By" time input ---
  const handleDoneByTimeChange = (time: string) => {
    updateFormData('doneByTime', time);
  };
  // -------------------------------------------------

  const selectedDays = ALL_DAYS.filter((day) => formData.availability[day]?.selected);

  // Basic validation: Disable next if a day is selected but times are missing
  // You might want more sophisticated validation (e.g., start time before end time)
  React.useEffect(() => {
    let isDisabled = false;
    for (const day of selectedDays) {
      if (!formData.availability[day].startTime || !formData.availability[day].endTime) {
        isDisabled = true;
        break;
      }
    }
    // You could also add validation for doneByTime if needed
    // e.g., if (someCondition && !formData.doneByTime) isDisabled = true;
    setIsButtonDisabled(isDisabled);
  }, [formData.availability, selectedDays, setIsButtonDisabled]);

  return (
    <div className="space-y-6">
      {/* Day Selection Toggles */}
      <div>
        <Label className="text-base font-medium">Select Available Days</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Choose the days you are typically available.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_DAYS.map((day) => (
            <Toggle
              key={day}
              variant="outline"
              pressed={formData.availability[day]?.selected || false}
              onPressedChange={(isPressed) => handleDayToggle(day, isPressed)}
              aria-label={`Toggle ${day}`}
              className="capitalize"
            >
              {day}
            </Toggle>
          ))}
        </div>
      </div>

      {/* --- Desired Completion Time Section --- */}
      <div className="mt-6 pt-4 border-t">
        {/* Added separator */}
        <Label htmlFor="doneByTime" className="text-base font-medium">
          Desired Completion Time
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Specify the time by which you would like to complete the task.
        </p>
        <Input
          id="doneByTime" // Added id for label association
          type="time"
          value={formData.doneByTime}
          onChange={(e) => handleDoneByTimeChange(e.target.value)}
          className="w-full md:w-1/2 lg:w-1/3" // Constrain width
          aria-label="Desired completion time" // Added aria-label
        />
      </div>
      {/* --------------------------------------- */}

      {/* Time Inputs for Selected Days */}
      {selectedDays.length > 0 && (
        <div>
          <Label className="text-base font-medium">Set Available Time Ranges</Label>
          <p className="text-sm text-muted-foreground mb-3">
            For each selected day, specify your start and end availability time.
          </p>
          {/* Adjusted styling for better scroll visibility if needed */}
          <div className="flex flex-col gap-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
            {selectedDays.map((day) => (
              <DayAvailabilityInput
                key={day}
                day={day}
                startTime={formData.availability[day].startTime}
                endTime={formData.availability[day].endTime}
                onStartTimeChange={(time) => handleTimeChange(day, 'startTime', time)}
                onEndTimeChange={(time) => handleTimeChange(day, 'endTime', time)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedDays.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Select one or more days above to set availability times.
        </p>
      )}
    </div>
  );
};
