import { createClient } from "@/lib/supabase/server";

export type AttendanceDay = {
  date: string;
  completed: boolean;
  isToday: boolean;
};

export type Attendance = {
  last7Days: AttendanceDay[];
  streak: number;
};

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// current_streak в profiles — кэш-колонка (добавлена в 009_extended_features.sql),
// но её некому поддерживать в актуальном состоянии без отдельного триггера/джобы
// на каждое завершение процедуры — такой инфраструктуры сейчас нет. Считаем
// посещаемость и streak на лету из procedures: дешевле и всегда точно.
export async function getAttendance(profileId: string): Promise<Attendance> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("procedures")
    .select("completed_at")
    .eq("profile_id", profileId)
    .order("completed_at", { ascending: false });
  if (error) throw error;

  const completedDates = new Set(
    (data ?? []).map((p) => toDateKey(new Date(p.completed_at))),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last7Days: AttendanceDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    last7Days.push({
      date: key,
      completed: completedDates.has(key),
      isToday: i === 0,
    });
  }

  // Считаем streak назад от сегодня; если сегодня ещё не сделано — начинаем
  // со вчера, чтобы серия не обнулялась раньше времени в течение дня.
  let streak = 0;
  const cursor = new Date(today);
  if (!completedDates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (completedDates.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { last7Days, streak };
}
