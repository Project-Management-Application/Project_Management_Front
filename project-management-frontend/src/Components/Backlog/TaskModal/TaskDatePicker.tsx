/* eslint-disable tailwindcss/no-contradicting-classname */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "flowbite-react";
import { HiCalendar, HiX } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

type TaskDatePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
};

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  showDatePicker,
  setShowDatePicker,
}) => {
  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select dates";
    const formattedStart = format(startDate, "MMM d");
    const formattedEnd = format(endDate, "MMM d");
    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 cursor-pointer hover:text-neon-blue transition-colors duration-300"
        onClick={() => setShowDatePicker(true)}
      >
        <HiCalendar className="w-6 h-6 text-neon-blue" />
        <h3 className="text-lg font-extrabold text-gray-200 tracking-wide bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Dates
        </h3>
      </div>
      <input
        type="text"
        value={formatDateRange()}
        disabled
        className="mt-3 w-full p-3 bg-dark-bg text-gray-400 rounded-lg border border-neon-purple/30 cursor-pointer hover:border-neon-purple/50 transition-colors duration-300"
        onClick={() => setShowDatePicker(true)}
      />
      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 bg-dark-bg border border-neon-purple/30 rounded-lg shadow-lg p-4 w-80 z-20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-200">Set Dates</h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMM d, yyyy"
                  className="w-full p-2 bg-dark-bg text-gray-200 border border-neon-purple/30 rounded-md focus:border-neon-purple/50 focus:ring-0"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="MMM d, yyyy"
                  className="w-full p-2 bg-dark-bg text-gray-200 border border-neon-purple/30 rounded-md focus:border-neon-purple/50 focus:ring-0"
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