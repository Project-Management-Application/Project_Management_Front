/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Send, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { Avatar } from '../../../../../UI/Avatar';
import { Textarea } from 'flowbite-react';
import { addComment, updateComment, deleteComment, getUserInfo } from '../../../../../../services/ProjectTaskApi';

interface Comment {
  id: string | number;
  userId: string | number;
  content: string;
  createdAt: Date | string;
}

interface TaskCommentsProps {
  taskId: number;
  comments: Comment[];
  onUpdate: () => void;
}

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments, onUpdate }) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [userInfos, setUserInfos] = useState<{ [key: string]: UserInfo }>({});
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch current user info and user info for comments
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUsers(true);
      try {
        // Fetch current user
        const currentUserData = await getUserInfo();
        setCurrentUser(currentUserData);

        // Fetch user info for all unique user IDs in comments
        const uniqueUserIds = Array.from(new Set(comments.map((comment) => comment.userId)));
        const userInfoPromises = uniqueUserIds.map(async (userId) => {
          const userInfo = await getUserInfo();
          return { userId, userInfo };
        });
        const userInfoResults = await Promise.all(userInfoPromises);
        const userInfoMap = userInfoResults.reduce((acc, { userId, userInfo }) => {
          acc[userId.toString()] = userInfo;
          return acc;
        }, {} as { [key: string]: UserInfo });
        setUserInfos(userInfoMap);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setError('Failed to load user info.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUserData();
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setError(null);
      await addComment(taskId, newComment);
      setNewComment('');
      onUpdate();
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      setError('Failed to post comment: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingContent.trim() || editingCommentId === null) return;

    try {
      setError(null);
      await updateComment(taskId, editingCommentId, editingContent);
      setEditingCommentId(null);
      setEditingContent('');
      onUpdate();
    } catch (err: any) {
      console.error('Failed to update comment:', err);
      setError('Failed to update comment: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      setError(null);
      await deleteComment(taskId, commentId);
      onUpdate();
    } catch (err: any) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment: ' + (err.message || 'Unknown error'));
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl bg-slate-800/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-indigo-300">Comments</h3>

      {/* Comment Input */}
      <div className="mb-6 flex gap-3">
        <Avatar
          username={`${currentUser?.firstName || 'User'} ${currentUser?.lastName || ''}`}
          src={currentUser?.avatar}
          size="md"
        />
        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
            placeholder="Write a comment..."
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="mt-2 bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
          >
            <Send className="mr-2 size-4" />
            Post Comment
          </Button>
          {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoadingUsers ? (
          <p className="text-indigo-200">Loading user info...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const user = userInfos[comment.userId.toString()] || currentUser;
            return (
              <div
                key={comment.id}
                className="flex gap-3 rounded-lg border border-indigo-500/20 bg-slate-900/50 p-4 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/10"
              >
                <Avatar
                  username={`${user?.firstName || 'User'} ${user?.lastName || ''}`}
                  src={user?.avatar}
                  size="sm"
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-indigo-300">
                      {user ? `${user.firstName} ${user.lastName}` : `User #${comment.userId}`}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
                      />
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpdateComment}
                          disabled={!editingContent.trim()}
                          className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCommentId(null)}
                          className="text-slate-400 hover:text-indigo-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-1 text-indigo-200">{comment.content}</p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditComment(comment)}
                          className="text-indigo-400 hover:text-indigo-200"
                        >
                          <Edit className="mr-1 size-3" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-rose-500 hover:text-rose-400"
                        >
                          <Trash2 className="mr-1 size-3" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-indigo-200">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};