import { Book } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import SocialLoginButtons from "@/components/ui/social-login-buttons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AuthLayout() {
  return (
    <div className="flex flex-col items-center">
      <Book className="h-20 w-20" />
      <h1 className="mt-[9px] text-2xl font-semibold tracking-tight">Welcome to MyVocab</h1>
      <p className="text-muted-foreground mt-[9px] text-sm">Your personal vocabulary learning assistant</p>
      <div className="mt-[27px] w-[350px]">
        <Tabs defaultValue="login" className="h-10 w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="rounded p-[27px] outline">
              <h2 className="text-xl font-semibold tracking-tight">Login to your account</h2>
              <p className="text-muted-foreground mt-[4.5px] text-sm">Enter your email and password to login</p>
              <div className="mt-[27px]">
                <SocialLoginButtons />
              </div>
              <div className="flex items-center justify-center py-4">
                <hr className="flex-grow border-gray-300" />
                <span className="text-muted-foreground px-2 text-[13px] uppercase">Or continue with</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <LoginForm />
            </div>
          </TabsContent>
          <TabsContent value="register">
            <div className="rounded p-[27px] outline">
              <h2 className="text-xl font-semibold tracking-tight">Create an account</h2>
              <p className="text-muted-foreground mt-[4.5px] text-sm">Enter your information to create an account</p>
              <div className="mt-[27px]">
                <SocialLoginButtons />
              </div>
              <div className="flex items-center justify-center py-4">
                <hr className="flex-grow border-gray-300" />
                <span className="text-muted-foreground px-2 text-[13px] uppercase">Or continue with</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <RegisterForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthLayout;
