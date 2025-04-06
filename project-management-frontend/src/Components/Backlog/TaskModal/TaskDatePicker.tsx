/* eslint-disable tailwindcss/no-contradicting-classname */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "flowbite-react";
import { HiCalendar, HiX } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface TaskDatePickerProps {
  startDate: Date | undefined; // Changed from Date | null to Date | undefined
  endDate: Date | undefined;   // Changed from Date | null to Date | undefined
  setStartDate: (date: Date | undefined) => void; // Adjusted to match
  setEndDate: (date: Date | undefined) => void;   // Adjusted to match
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
}

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  showDatePicker,
  setShowDatePicker,
}) => {
  const formatDateRange = (): string => {
    if (!startDate || !endDate) return "Select dates";
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
  };

  return (
    <div className="relative">
      <div
        className="flex cursor-pointer items-center gap-3 transition-colors duration-300 hover:text-neon-blue"
        onClick={() => setShowDatePicker(true)}
      >
        <HiCalendar className="size-6 text-neon-blue" />
        <h3 className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-lg font-extrabold tracking-wide text-gray-200 text-transparent">
          Dates
        </h3>
      </div>
      <input
        type="text"
        value={formatDateRange()}
        disabled
        className="mt-3 w-full cursor-pointer rounded-lg border border-neon-purple/30 bg-dark-bg p-3 text-gray-400 transition-colors duration-300 hover:border-neon-purple/50"
        onClick={() => setShowDatePicker(true)}
      />
      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-20 z-20 w-80 rounded-lg border border-neon-purple/30 bg-dark-bg p-4 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-200">Set Dates</h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-gray-400 transition-colors duration-300 hover:text-gray-200"
              >
                <HiX className="size-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date ?? undefined)} // Convert null to undefined
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMM d, yyyy"
                  className="w-full rounded-md border border-neon-purple/30 bg-dark-bg p-2 text-gray-200 focus:border-neon-purple/50 focus:ring-0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-300">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date ?? undefined)} // Convert null to undefined
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate} // Now correctly typed as Date | undefined
                  dateFormat="MMM d, yyyy"
                  className="w-full rounded-md border border-neon-purple/30 bg-dark-bg p-2 text-gray-200 focus:border-neon-purple/50 focus:ring-0"
                />
              </div>
            </div>
            <Button
              color="purple"
              size="sm"
              className="mt-4 w-full bg-neon-purple hover:bg-neon-purple/80"
              onClick={() => setShowDatePicker(false)}
            >
              Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskDatePicker;