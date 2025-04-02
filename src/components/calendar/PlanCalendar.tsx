import { TimetableEvent } from "@/types/calendar";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

// Helper function to add hours, correctly handling day wrap-around
function addHoursToTimeString(timeString: string, hours: number) {
  const [hour, minute] = timeString.split(':').map(Number);
  let date = new Date();
  date.setHours(hour, minute, 0, 0); // Set to timeString with any date
  date.setHours(date.getHours() + hours); // Add hours

  // Format back to HH:mm
  return date.toISOString().substring(11, 16);
}

const PlanCalendar = ({ timetable }: { timetable: TimetableEvent[] | undefined }) => {
  const events = timetable?.map((session) => ({
    title: `${session.title}`,
    start: session.startDateString,
    end: session.endDateString,
  }));

  if (!timetable) {
    return null;
  }

  let earliestTime = '24:00';
  let latestTime = '00:00';

  timetable.forEach((entry) => {
    // Extract the time part as HH:mm
    const startTime = entry.startDateString.substring(11, 16);
    const endTime = entry.endDateString.substring(11, 16);

    if (startTime < earliestTime) {
      earliestTime = startTime;
    }

    if (endTime > latestTime) {
      latestTime = endTime;
    }
  });

  const slotMinTime = addHoursToTimeString(earliestTime, -0); // Subtract 1 hour for leeway
  const slotMaxTime = addHoursToTimeString(latestTime, 0); // Add 1 hour for leeway

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridDay"
      events={events}
      headerToolbar={{
        right: 'timeGridDay,timeGridWeek prev,next',
      }}
      height={'88vh'}
      nowIndicator={true} // Show current time indicator
      expandRows={true} // Makes the calendar take up available height
      weekNumberCalculation={'ISO'} // Show ISO week numbers
      now={new Date()} // Show current time indicator
      slotMinTime={slotMinTime} // Start time for calendar
      slotMaxTime={slotMaxTime} // End time for calendar
      weekends={false} // Hide weekends
      initialDate={timetable[0]?.startDateString.substring(0, 10) || new Date()}
    />
  );
};

export default PlanCalendar;
