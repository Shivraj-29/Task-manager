import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA, STATUS_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [], // will store objects: { text, completed }
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      status: "Pending",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // 🔹 Normalize todos into {text, completed}
const normalizeTodosForBackend = (todos) => {
  if (!Array.isArray(todos)) return [];
  return todos
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { text: item, completed: false };
      }
      return { text: item.text ?? "", completed: !!item.completed };
    })
    .filter(Boolean);
};

// 🔹 Auto decide status from todos
const getAutoStatus = (todos) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;

  if (total === 0) return "Pending";
  if (completed === 0) return "Pending";
  if (completed === total) return "Completed";
  return "In Progress";
};


  const createTask = async () => {
  setLoading(true);

  try {
    const todolist = normalizeTodosForBackend(taskData.todoChecklist);
    const autoStatus = getAutoStatus(todolist);

    await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoChecklist: todolist,
      status: autoStatus, // ✅ enforce rules
    });

    toast.success("Task Created Successfully");
    clearData();
    navigate("/admin/tasks"); // optional redirect
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error(error?.response?.data?.message || "Failed to create task");
  } finally {
    setLoading(false);
  }
};


  const updateTask = async () => {
  setLoading(true);

  try {
    const todolist = normalizeTodosForBackend(taskData.todoChecklist);
    const autoStatus = getAutoStatus(todolist);

    await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoChecklist: todolist,
      status: autoStatus, // ✅ auto status applied
    });

    toast.success("Task Updated Successfully");
    navigate("/admin/tasks"); // optional redirect
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error(error?.response?.data?.message || "Failed to update task");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async () => {
    setError(null);

    // Input validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }

    if ((taskData.todoChecklist || []).length === 0) {
      setError("Add atleast one todo task");
      return;
    }

    if (taskId) {
      await updateTask();
      return;
    }

    await createTask();
  };

  // get Task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          status: taskInfo.status || "Pending",
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          // keep the full todo objects (text + completed)
          todoChecklist: taskInfo?.todoChecklist || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Failed to load task");
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Task details deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error deleting:",
        error.response?.data?.message || error.message
      );
      toast.error(error?.response?.data?.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // Toggle todo completed (for update view)
  const toggleTodoCompleted = (index) => {
    const updated = (taskData.todoChecklist || []).map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    handleValueChange("todoChecklist", updated);
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>

              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Status
                </label>
                <SelectDropdown
                  options={STATUS_DATA}
                  value={typeof taskData.status === "string" ? taskData.status : "Pending"}
                  onChange={(value) => handleValueChange("status", value)}
                  placeholder="Select Status"
                />
                <div className="text-xs text-gray-400 mt-1">Current: {String(taskData.status)}</div>
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>

              {taskId ? (
                // Update Form: show checkboxes (todoChecklist should be objects)
                <div className="space-y-2">
                  {(taskData.todoChecklist || []).map((todo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!todo.completed}
                        onChange={() => toggleTodoCompleted(index)}
                      />
                      <span className={todo.completed ? "line-through text-gray-400" : ""}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                // Create Form: pass strings to TodoListInput, and convert set values back to objects
                <TodoListInput
                  todoList={(taskData?.todoChecklist || []).map((i) =>
                    typeof i === "string" ? i : i.text
                  )}
                  setTodoList={(value) =>
                    handleValueChange(
                      "todoChecklist",
                      (value || []).map((text) => ({ text, completed: false }))
                    )
                  }
                />
              )}
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
