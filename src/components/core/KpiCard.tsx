import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ReactNode } from "react";

type Variant = "danger" | "warning" | "success" | "info";

type Props = {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: Variant;
};

const variantStyles: Record<Variant, string> = {
  danger: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-yellow-50 text-yellow-600 border-yellow-200",
  success: "bg-green-50 text-green-600 border-green-200",
  info: "bg-blue-50 text-blue-600 border-blue-200",
};

export default function KpiCard({
  title,
  value,
  icon,
  variant = "info",
}: Props) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <div
          className={`h-11 w-11 flex items-center justify-center rounded-xl border ${variantStyles[variant]}`}
        >
          {icon}
        </div>

        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent className="text-2xl font-bold">{value}</CardContent>
    </Card>
  );
}
