"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"; // @/lib/utils 경로가 실제 프로젝트 구조와 맞는지 확인 필요

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef(({ className, ...props }, ref) => <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
