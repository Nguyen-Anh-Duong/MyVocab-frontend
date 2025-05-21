"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const loginFormSchema = z.object({
    email: z.string().email("Must be an email."),
    password: z.string().min(0, "Password must length 0 or more.")
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
    try {
      // Example: Send login data to API endpoint
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        // Handle error response
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
        return;
      }

      // Handle successful login (e.g., redirect or show success)
      const data = await response.json();
      console.log("Login successful:", data);
      // Example: Redirect to dashboard
      // window.location.href = "/dashboard";
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
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
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
