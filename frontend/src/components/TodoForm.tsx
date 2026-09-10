import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createTodo } from "../../api";
import type { TodoInput } from "../../types/types";

const TodoForm = () => {
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TodoInput>({
		defaultValues: {
			title: "",
			description: "",
			is_complete: false,
		},
	});

	const createTodoMutation = useMutation({
		mutationFn: createTodo,
		onSuccess: () => {
			reset();
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			toast.success("Todo created");
		},
		onError: () => {
			toast.error("Unable to create todo");
		},
	});

	const onSubmit = (data: TodoInput) => {
		createTodoMutation.mutate(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20"
		>
			<h2 className="text-xl font-bold text-white">Add a todo</h2>
			<div className="mt-5 space-y-4">
				<div>
					<label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-slate-300">
						Title
					</label>
					<input
						id="title"
						type="text"
						{...register("title", {
							required: "Title is required",
							maxLength: { value: 200, message: "Title must be 200 characters or fewer" },
						})}
						className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
					/>
					{errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
				</div>

				<div>
					<label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-slate-300">
						Description
					</label>
					<textarea
						id="description"
						rows={4}
						{...register("description", { required: "Description is required" })}
						className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
					/>
					{errors.description && (
						<p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
					)}
				</div>

				<label className="flex items-center gap-2 text-sm font-medium text-slate-300">
					<input
						type="checkbox"
						{...register("is_complete")}
						className="size-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-500"
					/>
					Mark as complete
				</label>

				<button
					type="submit"
					disabled={createTodoMutation.isPending}
					className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{createTodoMutation.isPending ? "Creating..." : "Create todo"}
				</button>
			</div>
		</form>
	);
};

export default TodoForm;
