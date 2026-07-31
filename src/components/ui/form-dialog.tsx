/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number";
  description?: string;
  options?: { label: string; value: string }[];
}

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  schema: z.ZodObject<any, any, any>;
  defaultValues: Record<string, any>;
  fields: FieldConfig[];
  onSubmit: (values: any) => void | Promise<void>;
  submitText?: string;
}

export function FormDialog({
  isOpen,
  onClose,
  title,
  description,
  schema,
  defaultValues,
  fields,
  onSubmit,
  submitText = "Save",
}: FormDialogProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reset form values when open status changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, defaultValues, form]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display font-extrabold text-xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <div className="max-h-[360px] overflow-y-auto px-1 space-y-4">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem
                      className={
                        field.type === "checkbox"
                          ? "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                          : "space-y-1.5"
                      }
                    >
                      {field.type === "checkbox" ? (
                        <>
                          <FormControl>
                            <Checkbox
                              checked={formField.value}
                              onCheckedChange={formField.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">{field.label}</FormLabel>
                            {field.description && (
                              <FormDescription>{field.description}</FormDescription>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {field.type === "textarea" ? (
                              <Textarea
                                placeholder={field.placeholder}
                                className="resize-none min-h-[80px]"
                                {...formField}
                              />
                            ) : field.type === "select" ? (
                              <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={field.placeholder || "Select option"}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                {...formField}
                                onChange={(e) => {
                                  if (field.type === "number") {
                                    formField.onChange(
                                      e.target.value === "" ? "" : Number(e.target.value),
                                    );
                                  } else {
                                    formField.onChange(e.target.value);
                                  }
                                }}
                              />
                            )}
                          </FormControl>
                          {field.description && (
                            <FormDescription>{field.description}</FormDescription>
                          )}
                          <FormMessage />
                        </>
                      )}
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-gradient shadow-glow cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
