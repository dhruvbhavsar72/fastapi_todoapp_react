import { useForm } from "react-hook-form";
import { createUser } from "../../api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type RegisterForm = {
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password: string;
  phone_no: string;
};

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      reset();
      navigate("/login");
    },
    onError: (error) => {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Unable to save your account. Please try again.",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    mutation.mutate(data);
    console.log("Form data submitted:", data);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-8 sm:px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 font-sans shadow-2xl shadow-black/30"
      >
        <h1 className="mb-2 text-3xl font-bold text-white">
          Create your account
        </h1>
        <p className="mb-7 text-slate-400">Enter your details to get started.</p>

      {errors.root && (
        <p className="mb-4 text-[13px] text-red-600">{errors.root.message}</p>
      )}

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="first_name"
            className="mb-2 block font-semibold text-slate-300"
          >
            First name
          </label>
          <input
            id="first_name"
            type="text"
            className="box-border w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-[15px] text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            {...register("first_name", { required: "First name is required" })}
          />
          {errors.first_name && (
            <p className="mt-1.5 text-[13px] text-red-600">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="mb-2 block font-semibold text-slate-300"
          >
            Last name
          </label>
          <input
            id="last_name"
            type="text"
            className="box-border w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-[15px] text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            {...register("last_name", { required: "Last name is required" })}
          />
          {errors.last_name && (
            <p className="mt-1.5 text-[13px] text-red-600">
              {errors.last_name.message}
            </p>
          )}
        </div>

        {[
          [
            "email",
            "Email",
            "email",
            {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
            },
          ],
          [
            "user_name",
            "Username",
            "text",
            { required: "Username is required" },
          ],
          [
            "password",
            "Password",
            "password",
            {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            },
          ],
          [
            "phone_no",
            "Phone number",
            "tel",
            { required: "Phone number is required" },
          ],
        ].map(([name, label, type, rules]) => (
          <div key={name as string} className="col-span-full">
            <label
              htmlFor={name as string}
              className="mb-2 block font-semibold text-slate-300"
            >
              {label as string}
            </label>
            <input
              id={name as string}
              type={type as string}
              className="box-border w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-[15px] text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              {...register(name as keyof RegisterForm, rules as never)}
            />
            {errors[name as keyof RegisterForm] && (
              <p className="mt-1.5 text-[13px] text-red-600">
                {errors[name as keyof RegisterForm]?.message as string}
              </p>
            )}
          </div>
        ))}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 w-full cursor-pointer rounded-lg border-0 bg-cyan-400 px-4 py-2.5 text-base font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Saving..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
