import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-full w-full flex flex-col justify-center gap-5 p-8">
      <h1>Login</h1>
      <p className="pb-4">One step away from writing goodness!</p>
      <TextField name="email" type="email" label="Email" variant="standard" />
      <TextField
        name="password"
        type="password"
        label="Password"
        variant="standard"
      />
      <button className="mt-8 py-3 bg-[#222222] text-white font-bold rounded-md">
        Start Writing
      </button>
      <div className="text-sm mx-auto">
        New here?{" "}
        <Link to="/account/register" className="underline font-semibold">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
