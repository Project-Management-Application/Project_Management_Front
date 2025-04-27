/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { 
  User, CheckSquare, Calendar, Paperclip, Clock, CheckCircle2, Edit, CalendarClock, Trash2, Download, Loader2 
} from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { Avatar } from '../../../../../UI/Avatar';
import { Badge } from '../../../../../UI/Badge';
import { uploadTaskAttachment, deleteTaskAttachment } from '../../../../../../services/ProjectTaskApi';

interface Member {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface Label {
  id: string | number;
  tagValue: string;
  value: string;
  color: string;
}

interface Attachment {
  id: string | number;
  fileName: string;
  uploadedAt: Date | string;
  fileType: string;
  url?: string; // Made url optional to handle missing urls
}

interface TaskSidebarProps {
  taskId: number;
  members: Member[];
  labels?: Label[];
  assignedMemberIds?: (string | number)[];
  startDate?: Date | string;
  dueDate?: Date | string;
  attachments?: Attachment[];
  status?: string;
  onMembersClick?: () => void;
  onDatesClick?: () => void;
  onLabelsClick?: () => void;
  onChecklistClick?: () => void;
  onAttachmentAdd?: (attachment: Attachment) => void;
  onAttachmentDelete?: (attachmentId: string | number) => void;
  onUpdate: () => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  taskId,
  members,
  assignedMemberIds,
  startDate,
  dueDate,
  attachments,
  status,
  onMembersClick,
  onDatesClick,
  onChecklistClick,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadErrors, setDownloadErrors] = useState<Record<string | number, string | null>>({});

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'text/csv', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload PNG, JPEG, PDF, CSV, or TXT.');
      return;
    }

    setUploading(true);
    try {
      await uploadTaskAttachment(taskId, file);
      onUpdate();
      console.log('[TaskSidebar] Attachment uploaded:', { fileName: file.name });
    } catch (error) {
      console.error('[TaskSidebar] Failed to upload attachment:', error);
      alert('Failed to upload attachment. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: string | number) => {
    try {
      await deleteTaskAttachment(taskId, attachmentId);
      onUpdate();
      console.log('[TaskSidebar] Attachment deleted:', { attachmentId });
    } catch (error) {
      console.error('[TaskSidebar] Failed to delete attachment:', error);
      alert('Failed to delete attachment. Please try again.');
    }
  };

  const handleDownload = (attachment: Attachment) => {
    const { url, fileName, id } = attachment;
    console.log('[TaskSidebar] Initiating download:', { url, fileName, id });
    setDownloadErrors({ ...downloadErrors, [id]: null });

    if (!url || !fileName) {
      console.error('[TaskSidebar] Invalid attachment data:', { url, fileName, id });
      setDownloadErrors({ ...downloadErrors, [id]: 'Attachment URL or name missing.' });
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('[TaskSidebar] Download triggered:', { url, fileName, id });
    } catch (error) {
      console.error('[TaskSidebar] Download failed:', error);
      setDownloadErrors({ ...downloadErrors, [id]: 'Failed to download file. Please try again.' });
    }
  };

  const assignedMembers = assignedMemberIds
    ?.map(id => members.find(member => member.userId === Number(id)))
    .filter((member): member is Member => member !== undefined) || [];

  // Log attachments for debugging
  console.log('[TaskSidebar] attachments:', attachments);

  return (
    <div className="space-y-6">
      {/* Add to card section */}
      <div className="rounded-xl bg-slate-800/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Add to card
        </h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<User className="size-4 text-indigo-400" />}
            className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20"
            onClick={onMembersClick}
          >
            Members
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<CheckSquare className="size-4 text-indigo-400" />}
            className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20"
            onClick={onChecklistClick}
          >
            Checklist
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Calendar className="size-4 text-indigo-400" />}
            className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20"
            onClick={onDatesClick}
          >
            Dates
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Paperclip className="size-4 text-indigo-400" />}
            className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Attachment'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,application/pdf,text/csv,text/plain"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Members section */}
      {assignedMembers.length > 0 && (
        <div className="rounded-xl bg-slate-800/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Members</h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:text-indigo-200"
              onClick={onMembersClick}
            >
              <Edit className="size-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {assignedMembers.map((member) => (
              <div key={member.userId} className="flex items-center gap-2" title={`${member.firstName} ${member.lastName}`}>
                <Avatar
                  username={`${member.firstName} ${member.lastName}`}
                  size="md"
                />
                <span className="text-sm text-indigo-200">{`${member.firstName} ${member.lastName}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dates section */}
      {(startDate || dueDate) && (
        <div className="rounded-xl bg-slate-800/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Dates</h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:text-indigo-200"
              onClick={onDatesClick}
            >
              <Edit className="size-3.5" />
            </Button>
          </div>
          <div className="rounded-lg border border-indigo-500/20 bg-slate-900/50 p-4 shadow-sm transition-shadow hover:shadow">
            {startDate && (
              <div className="group flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-indigo-500/20">
                <div className="flex size-8 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-400">
                  <CalendarClock className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Start Date</p>
                  <p className="text-sm font-medium text-indigo-200">{formatDate(startDate)}</p>
                </div>
              </div>
            )}
            {dueDate && (
              <div className="group mt-3 flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-indigo-500/20">
                <div className={`flex size-8 items-center justify-center rounded-full ${
                  status === 'done' 
                    ? 'bg-green-500/30 text-green-400' 
                    : 'bg-yellow-500/30 text-yellow-400'
                }`}>
                  {status === 'done' ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Due Date</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${
                      status === 'done' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {formatDate(dueDate)}
                    </p>
                    {status === 'done' && (
                      <Badge variant="success" size="sm">Completed</Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attachments section */}
      {attachments && attachments.length > 0 && (
        <div className="rounded-xl bg-slate-800/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Attachments</h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-indigo-400 hover:text-indigo-200"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Edit className="size-3.5" />
            </Button>
          </div>
          {uploading && (
            <div className="mb-2 flex items-center gap-2 text-sm text-indigo-300">
              <Loader2 className="size-4 animate-spin" />
              <span>Uploading attachment...</span>
            </div>
          )}
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group flex items-center gap-3 rounded-lg border border-indigo-500/20 bg-slate-900/50 p-3 shadow-sm transition-all hover:scale-[1.02] hover:border-indigo-400/50 hover:bg-indigo-500/10"
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-indigo-500/30 text-indigo-400">
                  {attachment.fileType.startsWith('image/') && attachment.url ? (
                    <img
                      src={attachment.url}
                      alt={attachment.fileName}
                      className="size-full rounded-md object-cover"
                    />
                  ) : (
                    <Paperclip className="size-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {attachment.url ? (
                      <a
                        href={attachment.url}
                        download={attachment.fileName}
                        className="truncate text-sm font-medium text-indigo-200 transition-colors hover:text-indigo-300 hover:underline"
                        onClick={() => console.log('[TaskSidebar] Fallback download clicked:', { url: attachment.url, fileName: attachment.fileName, id: attachment.id })}
                      >
                        {attachment.fileName}
                      </a>
                    ) : (
                      <span className="truncate text-sm font-medium text-slate-400">{attachment.fileName}</span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-400 opacity-0 transition-opacity duration-200 hover:text-indigo-300 group-hover:opacity-100"
                      onClick={() => handleDownload(attachment)}
                      disabled={!attachment.url}
                    >
                      <Download className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400">
                    {attachment.uploadedAt ? formatDate(attachment.uploadedAt) : ''}
                  </p>
                  {downloadErrors[attachment.id] && (
                    <p className="text-xs text-rose-400">{downloadErrors[attachment.id]}</p>
                  )}
                </div>  
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-500 opacity-0 transition-opacity duration-200 hover:text-rose-400 group-hover:opacity-100"
                  onClick={() => handleDeleteAttachment(attachment.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};