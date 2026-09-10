import Todos from "../components/Todos";
import TodoForm from "../components/TodoForm";

const TodosList = () => {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <TodoForm />
      <Todos />
      </div>
    </main>
  );
};

export default TodosList;
