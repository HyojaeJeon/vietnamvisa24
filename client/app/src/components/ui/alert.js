"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"; // @/lib/utils 경로가 실제 프로젝트 구조와 맞는지 확인 필요

const alertVariants = cva("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
