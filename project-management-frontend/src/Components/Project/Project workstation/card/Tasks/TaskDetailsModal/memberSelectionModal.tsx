/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X, Check, Search } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { Avatar } from '../../../../../UI/Avatar';
import { assignMembersToTask, removeMemberFromTask } from '../../../../../../services/ProjectTaskApi';

interface Member {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface MemberSelectionModalProps {
  projectId: number;
  taskId: number;
  members: Member[];
  onClose: () => void;
  selectedMembers: (string | number)[];
  onSave: (members: (string | number)[]) => void;
}

export const MemberSelectionModal: React.FC<MemberSelectionModalProps> = ({
  taskId,
  members,
  onClose,
  selectedMembers,
  onSave,
}) => {
  const [selected, setSelected] = useState<(string | number)[]>(selectedMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (memberId: number) => {
    setSelected(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const initialMembers = new Set(selectedMembers.map(id => Number(id)));
      const newMembers = new Set(selected.map(id => Number(id)));

      const membersToAdd = [...newMembers].filter(id => !initialMembers.has(id));
      const membersToRemove = [...initialMembers].filter(id => !newMembers.has(id));

      if (membersToAdd.length > 0) {
        console.log(`[MemberSelectionModal] Assigning members to taskId: ${taskId}`, { membersToAdd });
        await assignMembersToTask(taskId, membersToAdd);
      }

      for (const userId of membersToRemove) {
        console.log(`[MemberSelectionModal] Removing userId: ${userId} from taskId: ${taskId}`);
        await removeMemberFromTask(taskId, userId);
      }

      console.log(`[MemberSelectionModal] Successfully updated members for taskId: ${taskId}`);
      onSave(selected);
      onClose();
    } catch (err) {
      console.error('[MemberSelectionModal] Failed to save member changes:', err);
      setError('Failed to save member changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-md rounded-xl bg-slate-900/80 p-6 shadow-xl ring-1 ring-indigo-500/30 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-indigo-200">Select Members</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-indigo-200"
            onClick={onClose}
            disabled={isSaving}
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full rounded-lg bg-slate-800/50 py-2 pl-10 pr-4 text-indigo-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-900 max-h-[300px] space-y-2 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <div className="py-4 text-center text-sm text-slate-400">No members found</div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.userId}
                className={`flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors ${
                  selected.includes(member.userId)
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-indigo-200 hover:bg-indigo-500/20'
                }`}
                onClick={() => toggleMember(member.userId)}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    username={`${member.firstName} ${member.lastName}`}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{`${member.firstName} ${member.lastName}`}</span>
                    <span className="text-xs text-slate-400">{member.email}</span>
                  </div>
                </div>
                {selected.includes(member.userId) && (
                  <Check className="size-5 text-indigo-400" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {error && <div className="text-sm text-rose-400">{error}</div>}
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-indigo-200"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};