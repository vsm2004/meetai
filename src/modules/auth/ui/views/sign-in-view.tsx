"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Github, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";   // <-- only this one (removed duplicate)
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

const FormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Must be a valid email"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

export const SignInview = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setError(null);
        setPending(true);
        const errorData = await authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    setPending(false);
                    router.push("/");
                },
                onError: ({ error }) => {
                    setPending(false);
                    setError(error.message);
                }
            }
        );
    };
    
    const onSocial =  (provider : "github" | "google") => {
            setError(null);
            setPending(true);
    
            authClient.signIn.social(
                {
                    provider:provider,
                    callbackURL: "/",
                },
                {
                    onSuccess: async () => {
                        setPending(false);
                    },
    
                    onError: ({ error }) => {
                        setPending(false);
                        setError(error.message);
                    }
                }
            );
        };// <-- FIXED: properly closed function

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">

                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>

                                <div className="grid gap-3">

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <input
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        {...field}
                                                    />
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
                                                    <input
                                                        type="password"
                                                        placeholder="*******"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <Button disabled={pending} type="submit" className="w-full">
                                    Sign In
                                </Button>

                                <div className="relative text-center text-sm my-4">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or Continue with
                                    </span>
                                    <div className="absolute inset-0 top-1/2 border-t border-border" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button disabled={pending} 
                                    onClick={() => onSocial("github")}
                                    variant="outline" type="button" className="w-full">
                                        <FaGithub />
                                    </Button>
                                    <Button disabled={pending} 
                                    onClick={() => onSocial("google")}
                                    variant="outline" type="button" className="w-full">
                                        <FaGoogle />
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Donot have an account?{" "}
                                    <Link href="/sign-up" className="underline underline-offset-4">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className= "bg-radial from-sidebar-accent to-sidebar relative flex flex-col gap-y-4 items-center justify-center">
                        <img src="logo.svg" alt="Image" className="h-[92px] w-[92px]" />
                        <p className="text-2xl font-semibold text-white">
                            Meet.AI
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};
