import { describe, expect, it } from "vitest";

import { formatCalendarTimeAge } from "./utils";

const labels = {
  ago: "Hace",
  minute: "minuto",
  minutes: "minutos",
  hour: "hora",
  hours: "horas",
  yesterday: "Ayer",
  justNow: "Justo ahora",
};

describe("formatCalendarTimeAge", () => {
  it("returns yesterday only for the previous calendar day", () => {
    expect(
      formatCalendarTimeAge(new Date("2026-06-15T18:00:00"), {
        language: "es",
        labels,
        now: new Date("2026-06-17T09:44:08"),
      }),
    ).toBe("15/06/2026");
  });

  it("returns yesterday for dates on the previous local day", () => {
    expect(
      formatCalendarTimeAge(new Date("2026-06-16T23:30:00"), {
        language: "es",
        labels,
        now: new Date("2026-06-17T00:10:00"),
      }),
    ).toBe("Ayer");
  });

  it("keeps same-day dates as relative hours", () => {
    expect(
      formatCalendarTimeAge(new Date("2026-06-17T07:10:00"), {
        language: "es",
        labels,
        now: new Date("2026-06-17T09:10:00"),
      }),
    ).toBe("Hace 2 horas");
  });
});
