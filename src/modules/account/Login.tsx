import { Button, TextField } from "@mui/material";
import { loginUserQuery } from "modules/core/network-utils";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col justify-center gap-5 p-8">
      <h1>Login</h1>
      <p className="pb-4">One step away from writing goodness!</p>
      <TextField
        name="email"
        type="email"
        label="Email"
        variant="standard"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        variant="standard"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="mt-8 py-3 bg-[#222222] text-white font-bold rounded-md"
        onClick={async () => {
          const user = await loginUserQuery({
            email,
            password,
          });
          localStorage.setItem("user", JSON.stringify(user.data));
          const navigateTo = searchParams.get("then") || "/";
          navigate(navigateTo);
        }}
      >
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
