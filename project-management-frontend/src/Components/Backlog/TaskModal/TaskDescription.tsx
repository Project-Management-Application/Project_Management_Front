/* eslint-disable tailwindcss/no-contradicting-classname */
import React, { useState } from "react";
import { Textarea } from "flowbite-react";

type TaskDescriptionProps = {
  description: string;
  setDescription: (description: string) => void;
  onSaveDescription: () => void;
};

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  description,
  setDescription,
  onSaveDescription,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSaveDescription();
      setIsEditing(false);
    }
  };

  return (
    <div>
      <h3 className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-lg font-extrabold tracking-wide text-gray-200 text-transparent">
        Description
      </h3>
      {isEditing ? (
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={() => {
            onSaveDescription();
            setIsEditing(false);
          }}
          placeholder="Add a more detailed description..."
          className="mt-3 w-full border-neon-purple/30 bg-dark-bg text-white focus:border-neon-purple/50 focus:ring-neon-purple"
          rows={4}
          autoFocus
        />
      ) : (
        <p
          className="mt-3 cursor-pointer text-gray-300 transition-colors duration-300 hover:text-gray-100"
          onClick={() => setIsEditing(true)}
        >
          {description || "Click to add a description..."}
        </p>
      )}
    </div>
  );
};

export default TaskDescription;