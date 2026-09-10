import { useForm } from "react-hook-form";
import type { LoginUser } from "../../types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, setAuthSession } from "../../api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUser>();

  const loginMutaion = useMutation({
    mutationFn: loginUser,

    onSuccess: () => {
      reset();
      setAuthSession();
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Login Successful");
      navigate("/todos");
    },
    onError: (error: any) => {
      toast.error("Login Failed", error);
    },
  });

  const onSubmit = (data: LoginUser) => {
    loginMutaion.mutate(data);
    console.log(data);
  };

  return (
    <div className="flex h-[calc(100dvh-71px)] items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30"
      >
        <h1 className="text-center text-2xl font-bold text-white">Login</h1>

        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-slate-300"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("user_name", { required: "Username is required" })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          {errors.user_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.user_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
