/* eslint-disable tailwindcss/no-contradicting-classname */
import React, { useState } from "react";
import { Textarea } from "flowbite-react";
import { HiChatAlt2 } from "react-icons/hi";

type TaskCommentsProps = {
  comments: string[];
  onAddComment: (comment: string) => void;
};

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <HiChatAlt2 className="w-6 h-6 text-neon-blue" />
        <h3 className="text-lg font-extrabold text-gray-200 tracking-wide bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Comments
        </h3>
      </div>
      <div className="mt-3 space-y-3">
        {comments.map((comment, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-neon-purple text-white rounded-full flex items-center justify-center text-sm font-semibold">
              MB
            </div>
            <div className="bg-dark-bg p-3 rounded-lg text-sm text-gray-300 border border-neon-purple/30">
              {comment}
              <div className="text-xs text-gray-500 mt-1">
                Apr 03, 2025, 10:18 AM
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="w-10 h-10 bg-neon-purple text-white rounded-full flex items-center justify-center text-sm font-semibold">
          MB
        </div>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a comment..."
          className="flex-1 bg-dark-bg text-white border-neon-purple/30 focus:ring-neon-purple focus:border-neon-purple/50"
          rows={2}
        />
      </div>
    </div>
  );
};

export default TaskComments;