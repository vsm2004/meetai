"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // SIGN UP
  const onSubmit = async () => {
    authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onError: () => {
          window.alert("Something went wrong");
        },
        onSuccess: () => {
          window.alert("User created successfully");
        },
      }
    );
  };

  // LOGIN
  const onLogin = async () => {
    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: () => window.alert("Login failed"),
        onSuccess: () => window.alert("Logged in successfully"),
      }
    );
  };

  // If logged in
  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>

        <Button onClick={() => authClient.signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">

        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={onSubmit}>Sign Up</Button>

        <Button onClick={onLogin} variant="secondary">
          Login
        </Button>
      </div>
    </div>
  );
}
