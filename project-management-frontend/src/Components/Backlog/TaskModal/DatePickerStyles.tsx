// DatePickerStyles.tsx
import React from "react";

const DatePickerStyles: React.FC = () => {
  return (
    <style>
      {`
        .react-datepicker {
          background-color: #1a1a2e !important;
          border: 1px solid rgba(147, 51, 234, 0.3) !important;
          border-radius: 0.5rem !important;
          font-family: 'Poppins', sans-serif !important;
        }
        .react-datepicker__header {
          background-color: #2a2a4e !important;
          border-bottom: none !important;
          padding: 0.5rem 0 !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #d1d1d1 !important;
          font-weight: 500 !important;
        }
        .react-datepicker__day {
          color: #d1d1d1 !important;
          border-radius: 0.25rem !important;
          transition: all 0.3s ease !important;
        }
        .react-datepicker__day:hover {
          background-color: rgba(147, 51, 234, 0.2) !important;
          color: #ffffff !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: transparent !important;
          color: #ffffff !important;
          border: 1px solid #9333ea !important;
          box-shadow: 0 0 8px rgba(147, 51, 234, 0.5) !important;
        }
        .react-datepicker__day--outside-month {
          color: #555570 !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #d1d1d1 !important;
        }
        .react-datepicker__triangle {
          display: none !important;
        }
        .react-datepicker__input-container input {
          background-color: #1a1a2e !important;
          color: #d1d1d1 !important;
          border: 1px solid rgba(147, 51, 234, 0.3) !important;
          border-radius: 0.375rem !important;
          padding: 0.5rem !important;
          font-size: 0.875rem !important;
          width: 100% !important;
          transition: all 0.3s ease !important;
        }
        .react-datepicker__input-container input:focus {
          outline: none !important;
          border-color: #9333ea !important;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2) !important;
        }
      `}
    </style>
  );
};

export default DatePickerStyles;