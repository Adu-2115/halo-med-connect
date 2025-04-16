
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NestedQueryButtonProps {
  onExecute: () => void;
  isLoading?: boolean;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const NestedQueryButton = ({
  onExecute,
  isLoading = false,
  label,
  icon,
  variant = "default",
}: NestedQueryButtonProps) => {
  return (
    <Button
      variant={variant}
      onClick={onExecute}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </Button>
  );
};

export default NestedQueryButton;
