import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { ForgotPasswordPage } from "@/app/(auth)/forgot-password/page";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-4">
        <CardHeader className="text-start">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field className="space-y-0">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="h-10 text-lg"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Link
                        href="#"
                        className="ml-auto text-xs underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mx-auto w-full max-w-sm flex flex-col justify-center items-center pb-8 px-4">
                        <DrawerHeader>
                          <DrawerTitle className="text-3xl font-light text-center">Forgot Password</DrawerTitle>
                          <DrawerDescription>No worries, we&apos;ll send you reset instructions.</DrawerDescription>
                        </DrawerHeader>
                        <ForgotPasswordPage />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="h-10"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="h-8 bg-indigo-600 hover:bg-indigo-600 cursor-pointer">
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
