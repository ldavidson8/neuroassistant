export type DayOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export const ALL_DAYS: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export interface DayAvailability {
    selected: boolean;
    startTime: string; // e.g., "HH:mm" format "09:00"
    endTime: string; // e.g., "HH:mm" format "17:30"
}

export interface DocumentData {
    file: File | null;
    text: string;
}

export interface FormData {
    availability: Record<DayOfWeek, DayAvailability>;
    isExam: boolean;
    document: DocumentData;
    doneByTime: string;
}

export interface DocumentData {
    file: File | null;
    text: string;
}

export interface FormStep {
    id: number;
    title: string;
    component: React.FC<StepProps>;
}

export interface StepProps {
    formData: FormData;
    setIsButtonDisabled: (isDisabled: boolean) => void;
    updateFormData: <K extends keyof FormData>(
        key: K,
        value: FormData[K]
    ) => void;
}
