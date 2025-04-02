// src/components/steps/AvailabilityStep.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import type { StepProps, DayOfWeek, DayAvailability } from '@/types/form'; // Adjust path
import { ALL_DAYS } from '@/types/form'; // Adjust path

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
        />

        <Input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          placeholder="End Time"
        />
      </div>
    </div>
  );
};

export const AvailabilityStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  setIsButtonDisabled,
}) => {
  const handleDayToggle = (day: DayOfWeek, isPressed: boolean) => {
    const currentAvailability = formData.availability;
    const updatedDayData: DayAvailability = {
      ...currentAvailability[day],
      selected: isPressed,
      // Clear times when deselecting the day
      startTime: isPressed ? currentAvailability[day].startTime : '',
      endTime: isPressed ? currentAvailability[day].endTime : '',
    };

    updateFormData('availability', {
      ...currentAvailability,
      [day]: updatedDayData,
    });

    // Enable or disable the button based on selected days
    const selectedDays = ALL_DAYS.filter((d) => currentAvailability[d]?.selected);
    setIsButtonDisabled(selectedDays.length === 0);
  };

  // Generic handler for time changes (start or end)
  const handleTimeChange = (day: DayOfWeek, type: 'startTime' | 'endTime', time: string) => {
    const currentAvailability = formData.availability;
    const dayData = currentAvailability[day];
    updateFormData('availability', {
      ...currentAvailability,
      [day]: { ...dayData, [type]: time }, // Update specific time field
    });
  };

  const selectedDays = ALL_DAYS.filter((day) => formData.availability[day]?.selected);

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

      {/* Time Inputs for Selected Days */}
      {selectedDays.length > 0 && (
        <div>
          <Label className="text-base font-medium">Set Available Time Ranges</Label>
          <p className="text-sm text-muted-foreground mb-3">
            For each selected day, specify your start and end availability time.
          </p>
          <div className="flex flex-col gap-y-2 max-h-64 overflow-y-scroll">
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
