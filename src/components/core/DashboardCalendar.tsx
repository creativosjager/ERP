"use client";

import { useState } from "react";
import { mockEvents } from "@/lib/mockEvents";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState("");

  const events = mockEvents.filter((event) => event.date === selectedDate);

  return (
    <Card className="rounded-2xl h-full">
      <CardHeader>
        <CardTitle className="text-lg">Calendario operativo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <input
          type="date"
          className="w-full rounded-md border px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Eventos</p>

          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay eventos</p>
          )}

          {events.map((event) => (
            <div key={event.id} className="rounded-md border p-2 text-sm">
              {event.title}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
