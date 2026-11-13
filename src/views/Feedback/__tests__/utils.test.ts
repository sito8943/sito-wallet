import { describe, expect, it } from "vitest";

import type { FeedbackDto } from "lib";

import {
  getFeedbackKindClassName,
  getFeedbackKindLabelKey,
  getFeedbackSourceLabelKey,
  isFeedbackResolved,
  splitFeedbackByStatus,
} from "../utils";

const buildEntry = (
  id: number,
  createdAt: string,
  resolvedAt: string | null = null,
): FeedbackDto => ({
  id,
  kind: "BUG",
  text: `Entry ${id}`,
  user: { id: 1, username: "ana", email: "ana@example.com" },
  account: null,
  source: "KEY",
  createdAt,
  resolvedAt,
});

describe("Feedback utils", () => {
  it("tells resolved entries apart", () => {
    expect(isFeedbackResolved(buildEntry(1, "2026-11-01T10:00:00"))).toBe(
      false,
    );
    expect(
      isFeedbackResolved(
        buildEntry(1, "2026-11-01T10:00:00", "2026-11-02T10:00:00"),
      ),
    ).toBe(true);
  });

  it("splits open and resolved entries, newest first", () => {
    const oldOpen = buildEntry(1, "2026-11-01T10:00:00");
    const resolved = buildEntry(
      2,
      "2026-11-02T10:00:00",
      "2026-11-03T10:00:00",
    );
    const newOpen = buildEntry(3, "2026-11-04T10:00:00");

    expect(splitFeedbackByStatus([oldOpen, resolved, newOpen])).toEqual({
      open: [newOpen, oldOpen],
      resolved: [resolved],
    });
  });

  it("returns empty groups for an empty inbox", () => {
    expect(splitFeedbackByStatus([])).toEqual({ open: [], resolved: [] });
  });

  it("maps kinds to labels and semantic classes", () => {
    expect(getFeedbackKindLabelKey("BUG")).toBe("_pages:feedback.kinds.bug");
    expect(getFeedbackKindLabelKey("MISSING")).toBe(
      "_pages:feedback.kinds.missing",
    );
    expect(getFeedbackKindLabelKey("IDEA")).toBe("_pages:feedback.kinds.idea");
    expect(getFeedbackKindClassName("BUG")).toBe("feedback-kind--bug");
    expect(getFeedbackKindClassName("MISSING")).toBe("feedback-kind--missing");
    expect(getFeedbackKindClassName("IDEA")).toBe("feedback-kind--idea");
  });

  it("maps sources to labels", () => {
    expect(getFeedbackSourceLabelKey("WEB")).toBe(
      "_pages:feedback.sources.web",
    );
    expect(getFeedbackSourceLabelKey("KEY")).toBe(
      "_pages:feedback.sources.key",
    );
    expect(getFeedbackSourceLabelKey("APP")).toBe(
      "_pages:feedback.sources.app",
    );
  });
});
