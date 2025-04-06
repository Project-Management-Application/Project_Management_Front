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

const TaskMembers: React.FC<TaskMembersProps> = () => {
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
          className="flex size-10 items-center justify-center rounded-full bg-neon-purple text-sm font-semibold text-white"
        >
          {member.initials}
        </div>
      ))}
      <HiPlus
        className="size-5 cursor-pointer text-neon-blue"
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
            className="absolute left-0 top-12 z-20 w-64 rounded-lg border border-neon-blue/50 bg-dark-bg p-4 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Members</h3>
              <button
                onClick={() => setShowMembersDropdown(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <HiX className="size-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search members..."
              className="mb-4 w-full rounded border border-neon-blue/50 bg-dark-card p-2 text-white focus:border-neon-blue focus:ring-neon-blue"
            />
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-medium text-gray-400">Card Members</h4>
                <div className="max-h-24 space-y-2 overflow-y-auto">
                  {cardMembers.map((member) => (
                    <div
                      key={member.initials}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neon-purple/20"
                      onClick={() => handleToggleMember(member, true)}
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-neon-purple text-xs font-semibold text-white">
                        {member.initials}
                      </div>
                      <span className="text-sm text-white">{member.name}</span>
                      <HiX className="ml-auto size-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-medium text-gray-400">Board Members</h4>
                <div className="max-h-24 space-y-2 overflow-y-auto">
                  {boardMembers.map((member) => (
                    <div
                      key={member.initials}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neon-blue/20"
                      onClick={() => handleToggleMember(member, false)}
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-neon-blue text-xs font-semibold text-white">
                        {member.initials}
                      </div>
                      <span className="text-sm text-white">{member.name}</span>
                      <HiPlus className="ml-auto size-4 text-neon-blue" />
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