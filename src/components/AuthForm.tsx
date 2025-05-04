import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupFormValues, UserRole } from '@/context/AuthTypes';
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleArrowUp } from "lucide-react";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import defaultLogo from "../assets/default-logo.png";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

export interface LoginFormValues {
  email: string;
  password: string;
}

type AuthFormProps = {
  type: "login" | "signup";
  onSubmit: (data: LoginFormValues | SignupFormValues) => void | Promise<void>;
  loading: boolean;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  role: z.enum(["Admin", "Manager", "Developer", "Viewer", "Project Manager"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  return data.organizationId ? !data.organizationName : !!data.organizationName;
}, {
  message: "Either organization ID or name must be provided",
  path: ["organizationName"],
});

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  loading,
}) => {
  const isLogin = type === "login";
  const [signupType, setSignupType] = useState<'new' | 'existing'>('new');
  const [forgotOpen, setForgotOpen] = useState(false);
  const schema = isLogin ? loginSchema : signupSchema;

  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isLogin
      ? {
          email: "",
          password: "",
        }
      : {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          organizationId: "",
          organizationName: "",
          role: "Developer" as UserRole,
        },
  });

  const [orgIdAvailabilityMsg, setOrgIdAvailabilityMsg] = React.useState<{text: string, error: boolean} | null>(null);
  const [checkingOrgId, setCheckingOrgId] = React.useState(false);
  const [companyLogo, setcompanyLogo] = useState(defaultLogo);

  const handleImageUpload = (e) => {
    e.preventDefault();
    console.log(e.target.files);
    setcompanyLogo(URL.createObjectURL(e.target.files[0]));
  }

  const checkOrgIdAvailability = async (orgId: string) => {
    if (!orgId || orgId.length < 3) return;
    setCheckingOrgId(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Create an account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your credentials to access your account"
            : "Fill in the form below to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            {!isLogin && (
              <>
                <Tabs value={signupType} onValueChange={(v) => setSignupType(v as 'new' | 'existing')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="new">New Organization</TabsTrigger>
                    <TabsTrigger value="existing">Join Organization</TabsTrigger>
                  </TabsList>
                </Tabs>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
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
                        <PasswordInput
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {signupType === 'new' ? (
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization ID</FormLabel>
                        <FormControl>
                          <Input placeholder="org-xxxxx-xxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {signupType === 'new' ? (
                            <>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Project Manager">Project Manager</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Project Manager">Project Manager</SelectItem>
                              <SelectItem value="Developer">Developer</SelectItem>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {signupType === 'new' ? (
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="company-logo">Company Logo</FormLabel>
                      <div className="relative w-20 h-20">
                        <img src={companyLogo} alt="Company logo preview" className="w-20 h-20 rounded-full border-2 border-solid" />
                        <CircleArrowUp className="absolute top-11 right-0 opacity-50 z-index:999" />
                        <input 
                          type="file" 
                          id="company-logo" 
                          onChange={handleImageUpload} 
                          className="w-10 h-20 absolute top-11 right-0 z-index:99 opacity-0"
                          aria-label="Upload company logo"
                          title="Click to upload company logo"
                          accept="image/*"
                        />
                      </div>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              </>
            )}

                

            {isLogin && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
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
                        <PasswordInput
                          placeholder="••••••••"
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end text-sm">
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setForgotOpen(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing</span>
                </div>
              ) : isLogin ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
        <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a
            href={isLogin ? "/signup" : "/login"}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;