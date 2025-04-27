/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { setTaskDates, updateTaskDates, resetTaskDates } from '../../../../../../services/ProjectTaskApi';

interface DateSelectionModalProps {
  onClose: () => void;
  taskId: number;
  startDate?: string | Date;
  dueDate?: string | Date;
  dueDateReminder?: string | Date;
  onSave: (dates: { startDate?: string; dueDate?: string; dueDateReminder?: string }) => void;
}

export const DateSelectionModal: React.FC<DateSelectionModalProps> = ({
  onClose,
  taskId,
  startDate: initialStartDate,
  dueDate: initialDueDate,
  dueDateReminder: initialDueDateReminder,
  onSave,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    initialStartDate
      ? typeof initialStartDate === 'string'
        ? new Date(initialStartDate)
        : initialStartDate
      : null
  );
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>(
    initialDueDate
      ? typeof initialDueDate === 'string'
        ? new Date(initialDueDate)
        : initialDueDate
      : null
  );
  const [reminderOption, setReminderOption] = useState<string>(
    initialDueDate && initialDueDateReminder
      ? calculateReminderOption(initialDueDate, initialDueDateReminder)
      : 'None'
  );
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    selectedStartDate ? selectedStartDate.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    selectedStartDate ? selectedStartDate.getFullYear() : new Date().getFullYear()
  );
  const [activeDateField, setActiveDateField] = useState<'start' | 'due' | null>(null);

  // Helper to calculate reminder option based on due date and reminder date
  function calculateReminderOption(dueDate?: string | Date, dueDateReminder?: string | Date): string {
    if (!dueDate || !dueDateReminder) return 'None';
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const reminder = typeof dueDateReminder === 'string' ? new Date(dueDateReminder) : dueDateReminder;
    if (!(due instanceof Date) || !(reminder instanceof Date)) return 'None';
    const diffTime = due.getTime() - reminder.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'At time of due date';
    if (diffDays === 1) return '1 Day before';
    if (diffDays === 2) return '2 Days before';
    if (diffDays === 7) return '1 Week before';
    return 'None';
  }

  // Calculate dueDateReminder based on the selected reminder option
  const calculateDueDateReminder = (dueDate: Date, option: string): Date | null => {
    if (option === 'None') return null;
    const reminderDate = new Date(dueDate);
    if (option === 'At time of due date') return reminderDate;
    if (option === '1 Day before') reminderDate.setDate(reminderDate.getDate() - 1);
    if (option === '2 Days before') reminderDate.setDate(reminderDate.getDate() - 2);
    if (option === '1 Week before') reminderDate.setDate(reminderDate.getDate() - 7);
    return reminderDate;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (activeDateField === 'start') {
      setSelectedStartDate(newDate);
      if (selectedDueDate && newDate > selectedDueDate) {
        setSelectedDueDate(null);
      }
    } else if (activeDateField === 'due') {
      setSelectedDueDate(newDate);
      if (selectedStartDate && newDate < selectedStartDate) {
        setSelectedStartDate(null);
      }
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handlePreviousYear = () => {
    setCurrentYear((year) => year - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((year) => year + 1);
  };

  const handleSave = async () => {
    if (!selectedStartDate || !selectedDueDate) {
      setError('Start date and due date are required.');
      return;
    }

    const dueDateReminder = calculateDueDateReminder(selectedDueDate, reminderOption);
    if (dueDateReminder && dueDateReminder > selectedDueDate) {
      setError('Reminder cannot be after the due date.');
      return;
    }

    setError(null);
    const dates = {
      startDate: selectedStartDate.toISOString(),
      dueDate: selectedDueDate.toISOString(),
      dueDateReminder: dueDateReminder ? dueDateReminder.toISOString() : undefined,
    };

    try {
      if (initialStartDate || initialDueDate) {
        await updateTaskDates(taskId, dates);
      } else {
        await setTaskDates(taskId, dates);
      }
      onSave(dates);
    } catch (err) {
      console.error('Failed to save dates:', err);
      setError('Failed to save dates. Please try again.');
    }
  };

  const handleRemove = async () => {
    try {
      await resetTaskDates(taskId);
      onSave({ startDate: undefined, dueDate: undefined, dueDateReminder: undefined });
    } catch (err) {
      console.error('Failed to reset dates:', err);
      setError('Failed to reset dates. Please try again.');
    }
  };

  // Generate calendar for the current month and year
  const generateCalendar = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar: (string | number)[][] = [];
    let week: (string | number)[] = Array(firstDay).fill('');
    let day = 1;

    while (day <= daysInMonth) {
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
      week.push(day);
      day++;
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push('');
      }
      calendar.push(week);
    }

    while (calendar.length < 6) {
      calendar.push(Array(7).fill(''));
    }

    return calendar;
  };

  const calendarDays = generateCalendar(currentMonth, currentYear);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isDateInRange = (day: number) => {
    if (!selectedStartDate || !selectedDueDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    const start = new Date(selectedStartDate);
    start.setHours(0, 0, 0, 0);
    const due = new Date(selectedDueDate);
    due.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= start && date <= due;
  };

  const formatDateTimeForInput = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'due') => {
    const date = new Date(e.target.value);
    if (isNaN(date.getTime())) return; // Ignore invalid dates
    if (type === 'start') {
      setSelectedStartDate(date);
      if (selectedDueDate && date > selectedDueDate) {
        setSelectedDueDate(null);
      }
    } else {
      setSelectedDueDate(date);
      if (selectedStartDate && date < selectedStartDate) {
        setSelectedStartDate(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-md transition-opacity duration-300">
      <div
        className="w-[95vw] max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-2xl ring-1 ring-indigo-500/30 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <h2 className="text-base font-semibold text-indigo-300">Dates</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-all hover:scale-110 hover:bg-slate-800 hover:text-indigo-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Month Display with Navigation */}
        <div className="my-3 text-center">
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-900/50 px-3 py-1 text-base font-medium text-indigo-200">
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
              onClick={handlePreviousYear}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
              onClick={handleNextMonth}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
              onClick={handleNextYear}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-4 rounded-xl bg-slate-800/80 p-3 shadow-lg backdrop-blur-md">
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-xs font-medium text-indigo-300">
                {day}
              </div>
            ))}
            {calendarDays.flat().map((day, index) => (
              <button
                key={index}
                onClick={() => day && handleDateClick(day as number)}
                className={`rounded-full p-1 text-xs transition-all ${
                  day
                    ? isDateInRange(day as number)
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'text-indigo-200 hover:bg-indigo-500/20'
                    : 'text-transparent'
                }`}
                disabled={!day}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Date Fields */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-indigo-300">Start Date</label>
            <input
              type="datetime-local"
              value={formatDateTimeForInput(selectedStartDate)}
              onChange={(e) => handleDateTimeChange(e, 'start')}
              onFocus={() => setActiveDateField('start')}
              className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-indigo-300">Due Date</label>
            <input
              type="datetime-local"
              value={formatDateTimeForInput(selectedDueDate)}
              onChange={(e) => handleDateTimeChange(e, 'due')}
              onFocus={() => setActiveDateField('due')}
              className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Reminder Section */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-indigo-300">
            Set due date reminder
          </label>
          <select
            value={reminderOption}
            onChange={(e) => setReminderOption(e.target.value)}
            className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
          >
            <option value="None">None</option>
            <option value="At time of due date">At time of due date</option>
            <option value="1 Day before">1 Day before</option>
            <option value="2 Days before">2 Days before</option>
            <option value="1 Week before">1 Week before</option>
          </select>
          <p className="mt-1 text-xs text-slate-400">
            Reminders will be sent to all members and watchers of this card.
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="mb-4 text-xs text-rose-400">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-rose-500 hover:bg-rose-500/20 hover:text-rose-400"
          >
            Remove
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};