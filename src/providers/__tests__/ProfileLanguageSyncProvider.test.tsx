import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockChangeLanguage = vi.fn(() => Promise.resolve());
const mockUseAuth = vi.fn();
const mockUseMyProfile = vi.fn();
const mockUseTranslation = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("hooks", () => ({
  useMyProfile: () => mockUseMyProfile(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => mockUseTranslation(),
}));

import { ProfileLanguageSyncProvider } from "../ProfileLanguageSyncProvider";

describe("ProfileLanguageSyncProvider", () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    mockUseAuth.mockReturnValue({
      account: { id: 7, email: "sito@example.com" },
    });
    mockUseMyProfile.mockReturnValue({
      data: { language: "es-ES" },
    });
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: "en",
        resolvedLanguage: "en",
        changeLanguage: mockChangeLanguage,
      },
    });
  });

  it("applies the profile language when it differs from the active app language", async () => {
    render(
      <ProfileLanguageSyncProvider>
        <div>content</div>
      </ProfileLanguageSyncProvider>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();

    await waitFor(() => expect(mockChangeLanguage).toHaveBeenCalledWith("es"));
  });

  it("does not change the app language when it already matches the profile", async () => {
    mockUseTranslation.mockReturnValue({
      i18n: {
        language: "es",
        resolvedLanguage: "es",
        changeLanguage: mockChangeLanguage,
      },
    });

    render(
      <ProfileLanguageSyncProvider>
        <div>content</div>
      </ProfileLanguageSyncProvider>,
    );

    await waitFor(() => expect(mockChangeLanguage).not.toHaveBeenCalled());
  });

});
