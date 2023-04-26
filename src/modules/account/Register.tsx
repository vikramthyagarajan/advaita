import { Button, TextField } from "@mui/material";

const Register = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center gap-5 p-8">
      <h1>Create an account</h1>
      <p className="pb-4">Let's get started with your 30 day trial</p>
      <TextField label="Name" variant="standard" />
      <TextField name="email" type="email" label="Email" variant="standard" />
      <TextField
        name="password"
        type="password"
        label="Password"
        variant="standard"
      />
      <button className="mt-8 py-3 bg-[#222222] text-white font-bold rounded-md">
        Create account
      </button>
      <div className="text-sm mx-auto">
        Already have an account?{" "}
        <span className="underline font-semibold">Log in</span>
      </div>
    </div>
  );
};

export default Register;
