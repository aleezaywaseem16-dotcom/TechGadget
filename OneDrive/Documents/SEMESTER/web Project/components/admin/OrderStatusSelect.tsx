"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/actions/admin-orders";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  statusColors: Record<string, string>;
}

export function OrderStatusSelect({ orderId, currentStatus, statusColors }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result?.error) {
        toast.error(result.error);
        setStatus(currentStatus);
      } else {
        toast.success("Order status updated");
      }
    });
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={cn(
        "text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer outline-none focus:ring-2 focus:ring-primary capitalize",
        statusColors[status] ?? "bg-gray-100 text-gray-600",
        isPending && "opacity-60"
      )}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-background text-foreground capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
