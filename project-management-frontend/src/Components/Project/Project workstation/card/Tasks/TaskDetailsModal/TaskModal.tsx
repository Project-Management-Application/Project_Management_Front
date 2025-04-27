/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckSquare, ImageIcon, Trash2, Edit2, Save, XCircle } from 'lucide-react';
import { Task, Key } from '../../../../../../types/Task';
import { getTaskDetails, addTaskDescription, updateTaskDescription, getAllChecklists, createChecklist, assignLabelsToTask, removeLabelFromTask, getAllComments, updateTaskCover, deleteTask, updateTaskName } from '../../../../../../services/ProjectTaskApi';
import { Spinner } from 'flowbite-react';
import { Button } from '../../../../../UI/Button';
import { TaskDescription } from './TaskDescription';
import { TaskChecklist } from './TaskChecklist';
import { TaskComments } from '../TaskDetailsModal/TaskComment';
import { TaskSidebar } from './TaskSidebar';
import { DateSelectionModal } from '../TaskDetailsModal/DateSelectionModalProps';
import { LabelSelectionModal } from './LabelSelectionModalProps';
import { ChecklistModal } from './CheckListModal';
import { CoverSelectionModal } from './CoverSelectionModal';
import { MemberSelectionModal } from './memberSelectionModal';

interface Member {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface TaskModalProps {
  task: Task;
  projectId: number;
  members: Member[];
  onClose: () => void;
  refreshProjectData: () => Promise<void>;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, projectId, members, onClose, refreshProjectData }) => {
  const [taskDetails, setTaskDetails] = useState<Task>({ ...task });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingDescription, setIsEditingDescription] = useState(!task.description);
  const [description, setDescription] = useState(task.description || '');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const fetchTaskDetails = async (initialLoad: boolean = false) => {
    try {
      if (initialLoad) setIsLoading(true);
      const [taskData, checklistsData, commentsData] = await Promise.all([
        getTaskDetails(task.id),
        getAllChecklists(task.id),
        getAllComments(task.id),
      ]);

      console.log('[TaskModal] taskData.attachments:', taskData.attachments); // Debug log

      const processedChecklists = checklistsData?.map((checklist: any) => ({
        id: checklist.id,
        title: checklist.title || 'Untitled Checklist',
        items: checklist.items?.map((item: any) => ({
          id: item.id,
          text: item.content || item.text || '',
          completed: item.completed !== undefined ? Boolean(item.completed) : Boolean(item.isCompleted),
        })) || [],
      })) || [];

      const processedLabels = taskData.labels?.map((label: any) => ({
        id: label.id,
        tagValue: label.tagValue || label.value || '',
        value: label.tagValue || label.value || '',
        color: label.color || '#9CA3AF',
      })) || [];

      const processedComments = commentsData?.map((comment: any) => ({
        id: comment.id,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
      })) || [];

      setTaskDetails({
        ...taskData,
        checklists: processedChecklists,
        labels: processedLabels,
        comments: processedComments,
      });

      setDescription(taskData.description || '');
      if (initialLoad) setIsEditingDescription(!taskData.description);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setDescriptionError('Failed to load task details');
    } finally {
      if (initialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails(true);

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [task.id, handleClose]);

  const handleDescriptionSave = async (newDescription: string) => {
    if (!newDescription.trim()) {
      setDescriptionError('Description cannot be blank');
      return;
    }

    setIsSaving(true);
    setDescriptionError(null);
    try {
      if (taskDetails.description) {
        await updateTaskDescription(taskDetails.id, newDescription);
      } else {
        await addTaskDescription(taskDetails.id, newDescription);
      }
      setTaskDetails({ ...taskDetails, description: newDescription });
      setDescription(newDescription);
      setIsEditingDescription(false);
    } catch (error: any) {
      setDescriptionError(error.response?.data || 'Failed to save description');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    console.log(`[TaskModal] Starting deletion process for taskId: ${taskDetails.id}`);
    setDeleteError(null);
    setIsDeleting(true);

    try {
      await deleteTask(taskDetails.id);
      console.log(`[TaskModal] Successfully called deleteTask API for taskId: ${taskDetails.id}`);
      setShowDeleteConfirm(false);
      await refreshProjectData();
      console.log(`[TaskModal] Refreshed project data after deleting taskId: ${taskDetails.id}`);
      handleClose();
      console.log(`[TaskModal] Closed modal after deleting taskId: ${taskDetails.id}`);
    } catch (error) {
      console.error(`[TaskModal] Failed to delete taskId: ${taskDetails.id}`, error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddChecklist = async (checklist: { title: string; items: { id: string | number; text: string; completed: boolean }[] }) => {
    try {
      await createChecklist(taskDetails.id, checklist.title);
      await fetchTaskDetails();
    } catch (error) {
      console.error('Failed to create checklist:', error);
    }
  };

  const handleUpdateChecklists = async () => {
    await fetchTaskDetails();
  };

  const handleRemoveLabel = async (labelId: Key | null | undefined) => {
    if (labelId == null) return;

    try {
      const labelIdForApi = typeof labelId === 'bigint' ? labelId.toString() : labelId;
      await removeLabelFromTask(taskDetails.id, labelIdForApi);
      setTaskDetails({
        ...taskDetails,
        labels: taskDetails.labels?.filter(label => label.id !== labelId) || [],
      });
      setLabelError(null);
    } catch (error: any) {
      console.error('Failed to remove label:', error);
      setLabelError(error.response?.status === 404
        ? 'Label removal endpoint not found. Please contact support.'
        : 'Failed to remove label: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSaveLabels = async (selectedLabelIds: (string | number)[]) => {
    try {
      setLabelError(null);
      await assignLabelsToTask(taskDetails.id, selectedLabelIds);
      await fetchTaskDetails();
    } catch (error: any) {
      console.error('Failed to save labels:', error);
      setLabelError(error.response?.status === 404
        ? 'Label assignment endpoint not found. Please contact support.'
        : 'Failed to save labels: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSaveCover = async (coverData: { image?: string; color?: string }) => {
    try {
      await updateTaskCover(taskDetails.id, coverData);
      await fetchTaskDetails();
    } catch (error) {
      console.error('Failed to update cover:', error);
      alert('Failed to update cover. Please try again.');
    }
  };

  const handleSaveName = async () => {
    if (!newTaskName.trim()) {
      setNameError('Task name cannot be blank');
      return;
    }

    try {
      setNameError(null);
      await updateTaskName(taskDetails.id, newTaskName);
      setTaskDetails({ ...taskDetails, name: newTaskName });
      setIsEditingName(false);
      await refreshProjectData();
      console.log(`[TaskModal] Refreshed project data after updating name for taskId: ${taskDetails.id}`);
    } catch (error) {
      console.error('Failed to update task name:', error);
      setNameError('Failed to update task name. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-md transition-opacity duration-300"
      style={{
        opacity: isClosing ? 0 : 1,
        paddingLeft: '264px',
        paddingTop: '64px',
      }}
      onClick={handleBackgroundClick}
    >
      <div
        className="scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-900 max-h-[calc(100vh-80px)] w-[95vw] max-w-5xl overflow-y-auto rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl ring-1 ring-indigo-500/30 transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          opacity: isClosing ? '0' : '1',
          marginTop: '-32px',
          marginLeft: '-132px',
        }}
      >
        {isLoading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <Spinner size="xl" className="text-indigo-400" />
          </div>
        ) : (
          <>
            {taskDetails.coverImage || taskDetails.coverColor ? (
              <div className="relative h-48 w-full overflow-hidden">
                {taskDetails.coverImage ? (
                  <img
                    src={taskDetails.coverImage}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div
                    className="size-full transition-transform duration-500 hover:scale-105"
                    style={{ backgroundColor: taskDetails.coverColor }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-indigo-500/30 text-indigo-200 backdrop-blur-md transition-transform hover:scale-105 hover:bg-indigo-500/40"
                    onClick={() => setShowCoverModal(true)}
                  >
                    Cover
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative flex h-32 w-full items-center justify-center bg-gradient-to-r from-indigo-900 to-slate-900">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-500/50 bg-indigo-500/30 text-indigo-200 backdrop-blur-md transition-transform hover:scale-105 hover:bg-indigo-500/40"
                  onClick={() => setShowCoverModal(true)}
                >
                  <ImageIcon className="mr-2 size-4" />
                  Add Cover
                </Button>
              </div>
            )}

            <div className="sticky top-0 z-10 border-b border-indigo-500/20 bg-slate-900/95 backdrop-blur-md">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="mt-1 size-5 shrink-0 text-indigo-400" />
                    {isEditingName ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          className="rounded-lg border-indigo-500/20 bg-slate-900/50 px-3 py-1 text-xl font-semibold text-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                        />
                        {nameError && <p className="text-xs text-rose-400">{nameError}</p>}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveName}
                            className="text-indigo-300 hover:bg-indigo-500/20"
                          >
                            <Save className="mr-2 size-4" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsEditingName(false);
                              setNewTaskName(taskDetails.name);
                              setNameError(null);
                            }}
                            className="text-rose-500 hover:bg-rose-500/20"
                          >
                            <XCircle className="mr-2 size-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-indigo-200">{taskDetails.name}</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsEditingName(true)}
                          className="text-indigo-300 hover:bg-indigo-500/20"
                        >
                          <Edit2 className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-rose-500 hover:bg-rose-500/20 hover:text-rose-400"
                      onClick={() => {
                        console.log(`[TaskModal] Delete button clicked for taskId: ${taskDetails.id}, showing confirmation`);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                    <button
                      onClick={handleClose}
                      className="rounded-full p-1.5 text-slate-400 transition-all hover:scale-110 hover:bg-slate-800 hover:text-indigo-300"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>
                <div className="ml-8 mt-2 flex flex-col gap-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    {taskDetails.labels && taskDetails.labels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {taskDetails.labels.map((label) => (
                          <div key={label.id} className="relative flex items-center">
                            <span
                              className="rounded-md px-2 py-0.5 text-xs font-medium text-indigo-200"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.tagValue}
                            </span>
                            {label.id != null && (
                              <button
                                onClick={() => handleRemoveLabel(label.id)}
                                className="ml-1 text-indigo-200 hover:text-rose-400"
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-indigo-300">No labels</span>
                    )}
                  </div>
                  {labelError && (
                    <p className="text-xs text-rose-400">{labelError}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
              <div className="col-span-1 space-y-8 md:col-span-2">
                <TaskDescription
                  description={description}
                  isEditing={isEditingDescription}
                  isLoading={isSaving}
                  error={descriptionError}
                  onStartEdit={() => setIsEditingDescription(true)}
                  onSave={handleDescriptionSave}
                  onCancel={() => {
                    setIsEditingDescription(false);
                    setDescriptionError(null);
                  }}
                />

                {taskDetails.checklists?.length ? (
                  <TaskChecklist
                    taskId={taskDetails.id}
                    checklists={taskDetails.checklists}
                    onUpdate={handleUpdateChecklists}
                  />
                ) : null}

                <TaskComments
                  taskId={taskDetails.id}
                  comments={taskDetails.comments?.map((comment) => ({
                    ...comment,
                    id: comment.id as string | number,
                  })) || []}
                  onUpdate={fetchTaskDetails}
                />
              </div>

              <div className="col-span-1">
                <TaskSidebar
                  taskId={taskDetails.id}
                  members={members}
                  labels={taskDetails.labels?.map((label) => ({
                    id: label.id as string | number,
                    tagValue: label.tagValue,
                    value: label.value,
                    color: label.color,
                  }))}
                  assignedMemberIds={taskDetails.assignedMemberIds}
                  startDate={taskDetails.startDate}
                  dueDate={taskDetails.dueDate}
                  attachments={taskDetails.attachments?.map((attachment) => ({
                    id: attachment.id as string | number,
                    fileName: attachment.fileName,
                    uploadedAt: attachment.uploadedAt,
                    fileType: attachment.fileType,
                    url: attachment.url,
                  }))}
                  status={taskDetails.status}
                  onMembersClick={() => setShowMemberModal(true)}
                  onDatesClick={() => setShowDateModal(true)}
                  onLabelsClick={() => setShowLabelModal(true)}
                  onChecklistClick={() => setShowChecklistModal(true)}
                  onUpdate={fetchTaskDetails}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-200">Delete Task</h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete the task "{taskDetails.name}"? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="mt-2 text-sm text-rose-400">{deleteError}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log(`[TaskModal] Cancellation of deletion for taskId: ${taskDetails.id}`);
                  setShowDeleteConfirm(false);
                  setDeleteError(null);
                }}
                className="text-slate-400 hover:bg-slate-700"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log(`[TaskModal] Confirmed deletion for taskId: ${taskDetails.id}`);
                  handleDeleteTask();
                }}
                className="text-rose-500 hover:bg-rose-500/20"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMemberModal && (
        <MemberSelectionModal
          projectId={projectId}
          taskId={taskDetails.id}
          members={members}
          onClose={() => setShowMemberModal(false)}
          selectedMembers={taskDetails.assignedMemberIds || []}
          onSave={(members) => {
            setTaskDetails({ ...taskDetails, assignedMemberIds: members });
            setShowMemberModal(false);
            refreshProjectData();
          }}
        />
      )}

      {showDateModal && (
        <DateSelectionModal
          onClose={() => setShowDateModal(false)}
          taskId={taskDetails.id}
          startDate={taskDetails.startDate}
          dueDate={taskDetails.dueDate}
          dueDateReminder={taskDetails.dueDateReminder}
          onSave={(dates) => {
            setTaskDetails({ ...taskDetails, ...dates });
            setShowDateModal(false);
            fetchTaskDetails();
          }}
        />
      )}

      {showLabelModal && (
        <LabelSelectionModal
          onClose={() => setShowLabelModal(false)}
          selectedLabels={taskDetails.labels?.map((label) => label.id as string | number).filter((id): id is string | number => id != null) || []}
          onSave={handleSaveLabels}
        />
      )}

      {showChecklistModal && (
        <ChecklistModal
          onClose={() => setShowChecklistModal(false)}
          onSave={handleAddChecklist}
        />
      )}

      {showCoverModal && (
        <CoverSelectionModal
          onClose={() => setShowCoverModal(false)}
          onSave={handleSaveCover}
          currentCoverImage={taskDetails.coverImage}
          currentCoverColor={taskDetails.coverColor}
        />
      )}
    </div>
  );
};

export default TaskModal;