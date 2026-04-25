import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";

export const ForgotPasswordPage = () => {
  return (
    <form className="w-full mt-4" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email" className="text-lg">
            E-mail
          </FieldLabel>
          <Input
            type="email"
            id="email"
            required
            placeholder="Please enter your email address"
            className="h-12 text-xl placeholder:text-lg"
          />
        </Field>
        <Field>
          <Button 
            type="submit" // Ensures 'Enter' key submits the form
            className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          >
            Reset Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};