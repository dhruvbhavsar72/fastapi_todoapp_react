import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { deleteTodo, getTodos, updateTodo } from "../../api";
import type { Todo, TodoInput } from "../../types/types";

const formatTodoDate = (dateValue?: string) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (date.toDateString() === today.toDateString()) return `Today at ${timeLabel}`;
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeLabel}`;
  }
  return `${dateLabel} at ${timeLabel}`;
};

const Todos = () => {
  const queryClient = useQueryClient();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const todosQuery = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  const todos = todosQuery.data ?? [];
  const { register, handleSubmit, reset } = useForm<TodoInput>();

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingTodo(null);
      toast.success("Todo updated");
    },
    onError: () => toast.error("Unable to update todo"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted");
    },
    onError: () => toast.error("Unable to delete todo"),
  });

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
    reset({
      title: todo.title,
      description: todo.description,
      is_complete: todo.is_complete,
    });
  };

  const onSubmit = (data: TodoInput) => {
    if (editingTodo) updateMutation.mutate({ id: editingTodo.id, todo: data });
  };

  const handleDelete = (todoId: number) => {
    if (window.confirm("Delete this todo?")) {
      deleteMutation.mutate(todoId);
    }
  };

  if (todosQuery.isLoading) return <p>Loading todos...</p>;
  if (todosQuery.isError) return <p>Unable to load todos.</p>;

  return (
    <section>
      <h1 className="text-3xl font-bold text-white">Your todos</h1>
      {todos.length === 0 && (
        <p className="mt-4 text-slate-400">No todos yet.</p>
      )}
      <ul className="mt-5 space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-black/20"
          >
            {editingTodo?.id === todo.id ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                  {...register("title", { required: true, maxLength: 200 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
                />
                <textarea
                  {...register("description", { required: true })}
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
                />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" {...register("is_complete")} /> Mark as
                  complete
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-60"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTodo(null);
                      reset();
                    }}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-white">{todo.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {todo.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span
                      className={`rounded-full px-2.5 py-1 font-semibold ${
                        todo.is_complete
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {todo.is_complete ? "Complete" : "In progress"}
                    </span>
                    {todo.created_at && (
                      <span>Added {formatTodoDate(todo.created_at)}</span>
                    )}
                    {todo.updated_at && todo.updated_at !== todo.created_at && (
                      <span className="text-slate-600">
                        Updated {formatTodoDate(todo.updated_at)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => startEditing(todo)}
                    className="rounded-lg border border-cyan-400/40 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg border border-red-400/40 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Todos;
