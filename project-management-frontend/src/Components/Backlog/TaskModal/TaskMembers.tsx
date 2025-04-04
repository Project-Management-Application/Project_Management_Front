/* eslint-disable @typescript-eslint/no-unused-vars */
// TaskMembers.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiX } from "react-icons/hi";

type Member = {
  initials: string;
  name: string;
  avatar?: string;
};

type TaskMembersProps = {
  taskId: number;
};

const TaskMembers: React.FC<TaskMembersProps> = ({ taskId }) => {
  const [cardMembers, setCardMembers] = useState<Member[]>([
    { initials: "MB", name: "Med Benmaaouia" },
  ]);
  const [boardMembers, setBoardMembers] = useState<Member[]>([
    { initials: "AH", name: "Ahmed" },
    { initials: "SK", name: "Sara Khan" },
    { initials: "JD", name: "John Doe" },
  ]);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  const handleToggleMember = (member: Member, isCardMember: boolean) => {
    if (isCardMember) {
      setCardMembers(cardMembers.filter((m) => m !== member));
      setBoardMembers([...boardMembers, member]);
    } else {
      setBoardMembers(boardMembers.filter((m) => m !== member));
      setCardMembers([...cardMembers, member]);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {cardMembers.map((member) => (
        <div
          key={member.initials}
          className="w-10 h-10 bg-neon-purple text-white rounded-full flex items-center justify-center text-sm font-semibold"
        >
          {member.initials}
        </div>
      ))}
      <HiPlus
        className="w-5 h-5 text-neon-blue cursor-pointer"
        onClick={() => setShowMembersDropdown(!showMembersDropdown)}
      />
      <AnimatePresence mode="wait">
        {showMembersDropdown && (
          <motion.div
            key="members-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-12 left-0 bg-dark-bg border border-neon-blue/50 rounded-lg shadow-lg p-4 w-64 z-20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-white">Members</h3>
              <button
                onClick={() => setShowMembersDropdown(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search members..."
              className="w-full p-2 mb-4 bg-dark-card text-white border border-neon-blue/50 rounded focus:ring-neon-blue focus:border-neon-blue"
            />
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">Card Members</h4>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {cardMembers.map((member) => (
                    <div
                      key={member.initials}
                      className="flex items-center gap-2 cursor-pointer hover:bg-neon-purple/20 p-2 rounded"
                      onClick={() => handleToggleMember(member, true)}
                    >
                      <div className="w-8 h-8 bg-neon-purple text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {member.initials}
                      </div>
                      <span className="text-sm text-white">{member.name}</span>
                      <HiX className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">Board Members</h4>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {boardMembers.map((member) => (
                    <div
                      key={member.initials}
                      className="flex items-center gap-2 cursor-pointer hover:bg-neon-blue/20 p-2 rounded"
                      onClick={() => handleToggleMember(member, false)}
                    >
                      <div className="w-8 h-8 bg-neon-blue text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {member.initials}
                      </div>
                      <span className="text-sm text-white">{member.name}</span>
                      <HiPlus className="w-4 h-4 text-neon-blue ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskMembers;