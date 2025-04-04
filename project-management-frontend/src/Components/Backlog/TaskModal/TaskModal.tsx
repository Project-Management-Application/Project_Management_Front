import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import TaskHeader from "./TaskHeader";
import TaskDescription from "./TaskDescription";
import TaskMembers from "./TaskMembers";
import TaskLabels from "./TaskLabels";
import TaskDatePicker from "./TaskDatePicker";
import TaskChecklists from "./TaskChecklists";
import TaskComments from "./TaskComments";
import TaskSidebar from "./TaskSidebar";
import DatePickerStyles from "./DatePickerStyles";
import { updateTaskTitle, updateTaskLabel, getTaskDetails, updateTaskDescription, deleteTask, createComment } from "../../../services/backlogApi";
import { Button } from "flowbite-react";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  taskDescription: string;
  initialStatus?: string;
  onSaveTitle: (newTitle: string) => void;
  onSaveDescription: (newDesc: string) => void;
  onUpdateStatus?: (newStatus: string) => void;
  onDeleteTask?: (taskId: number) => void;
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
  taskTitle: initialTitle,
  taskDescription: initialDesc,
  initialStatus = "TODO",
  onSaveTitle,
  onSaveDescription,
  onUpdateStatus,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);
  const [status, setStatus] = useState(initialStatus);
  const [comments, setComments] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date("2025-02-17"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-02-20"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchTaskDetails = async () => {
        try {
          const taskDetails = await getTaskDetails(taskId);
          setTitle(taskDetails.title);
          setDescription(taskDetails.description);
          setStatus(taskDetails.label);
          setComments(taskDetails.commentSection.comments.map((c) => c.comment));
        } catch (error) {
          console.error("Error fetching task details:", error);
          setTitle(initialTitle);
          setDescription(initialDesc);
          setStatus(initialStatus);
        }
      };
      fetchTaskDetails();
    }
  }, [isOpen, taskId, initialTitle, initialDesc, initialStatus]);

  const handleSaveTitle = async () => {
    try {
      await updateTaskTitle(taskId, title);
      onSaveTitle(title);
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await updateTaskDescription({ taskId, description });
      onSaveDescription(description);
    } catch (error) {
      console.error("Error updating task description:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTaskLabel(taskId, newStatus);
      setStatus(newStatus);
      onUpdateStatus?.(newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddComment = async (newComment: string) => {
    if (newComment.trim()) {
      try {
        const taskDetails = await getTaskDetails(taskId);
        const commentSectionId = taskDetails.commentSection.commentSectionId;
        await createComment({ commentSectionId, comment: newComment });
        setComments([...comments, newComment]);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId);
      onDeleteTask?.(taskId);
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <DatePickerStyles />
      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 font-inter"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <Dialog.Panel as="div" className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto p-8 border border-indigo-500/30"
              >
                <TaskHeader
                  title={title}
                  setTitle={setTitle}
                  status={status}
                  onSaveTitle={handleSaveTitle}
                  onStatusChange={handleStatusChange}
                  onClose={onClose}
                />
                <div className="grid grid-cols-4 gap-8">
                  <div className="col-span-3 space-y-8">
                    <div className="flex flex-col gap-6">
                      <TaskMembers taskId={taskId} />
                      <TaskLabels
                        taskId={taskId}
                        showLabelDropdown={showLabelDropdown}
                        setShowLabelDropdown={setShowLabelDropdown}
                      />
                    </div>
                    <TaskDatePicker
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      showDatePicker={showDatePicker}
                      setShowDatePicker={setShowDatePicker}
                    />
                    <TaskDescription
                      description={description}
                      setDescription={setDescription}
                      onSaveDescription={handleSaveDescription}
                    />
                    <TaskChecklists
                      taskId={taskId}
                      showChecklistForm={showChecklistForm}
                      setShowChecklistForm={setShowChecklistForm}
                    />
                    <TaskComments comments={comments} onAddComment={handleAddComment} />
                  </div>
                  <TaskSidebar
                    taskId={taskId}
                    onShowDatePicker={() => setShowDatePicker(true)}
                    onShowChecklist={() => setShowChecklistForm(true)}
                    onShowLabels={() => setShowLabelDropdown(true)}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4 flex justify-end"
                >
                  <Button
                    size="sm"
                    onClick={handleDeleteTask}
                    className="bg-indigo-500/20 hover:bg-indigo-500/40 text-white font-semibold px-4 py-1 rounded-lg transition-all duration-300"
                  >
                    Delete Task
                  </Button>
                </motion.div>
              </motion.div>
            </Dialog.Panel>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskModal;