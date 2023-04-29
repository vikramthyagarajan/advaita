import { faker } from "@faker-js/faker";
import { Button, TextField } from "@mui/material";
import { registerUserQuery } from "modules/core/network-utils";
import { generateId } from "modules/core/project-utils";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col justify-center gap-5 p-8">
      <h1>Create an account</h1>
      <p className="pb-4">Let's get started with your 30 day trial</p>
      <TextField
        label="Name"
        variant="standard"
        onChange={(e) => setName(e.target.value)}
      />
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
        className="mt-8 py-3 bg-[#222222] text-white font-bold rounded-md disabled:bg-slate-300"
        disabled={name === "" || password === "" || email === ""}
        onClick={async () => {
          const user = await registerUserQuery({
            id: generateId(),
            name,
            email,
            password,
            avatar: faker.image.avatar(),
          });
          localStorage.setItem("user", JSON.stringify(user));
          const navigateTo = searchParams.get("then") || "/";
          navigate(navigateTo);
        }}
      >
        Create account
      </button>
      <div className="text-sm mx-auto">
        Already have an account?{" "}
        <Link to="/account/login" className="underline font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;
