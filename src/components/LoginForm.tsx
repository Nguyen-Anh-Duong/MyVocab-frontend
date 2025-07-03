"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");

  const loginFormSchema = z.object({
    email: z.string().email("Must be a valid email."),
    password: z.string().min(1, "Password is required.")
  });

  // Define your form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setSubmitError("");

    try {
      await login(values);
      console.log("Login successful!");
      // Redirect to home page after successful login
      window.location.href = "/";
    } catch (error: any) {
      setSubmitError(error.message || "Login failed");
      console.error("Login error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {(error || submitError) && (
          <div className="rounded bg-red-50 p-2 text-center text-sm text-red-500">{error || submitError}</div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
