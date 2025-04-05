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
        <HiChatAlt2 className="size-6 text-neon-blue" />
        <h3 className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-lg font-extrabold tracking-wide text-gray-200 text-transparent">
          Comments
        </h3>
      </div>
      <div className="mt-3 space-y-3">
        {comments.map((comment, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-neon-purple text-sm font-semibold text-white">
              MB
            </div>
            <div className="rounded-lg border border-neon-purple/30 bg-dark-bg p-3 text-sm text-gray-300">
              {comment}
              <div className="mt-1 text-xs text-gray-500">
                Apr 03, 2025, 10:18 AM
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-neon-purple text-sm font-semibold text-white">
          MB
        </div>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a comment..."
          className="flex-1 border-neon-purple/30 bg-dark-bg text-white focus:border-neon-purple/50 focus:ring-neon-purple"
          rows={2}
        />
      </div>
    </div>
  );
};

export default TaskComments;