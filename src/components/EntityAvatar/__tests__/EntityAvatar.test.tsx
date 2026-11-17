import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";

vi.mock("@sito/dashboard-app", () => ({
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
}));

vi.mock("../../ProviderPhoto", () => ({
  ProviderPhoto: ({
    photo,
    alt,
    className,
    onError,
  }: {
    photo?: string | null;
    alt?: string;
    className?: string;
    onError?: () => void;
  }) => (
    <img
      src={photo ?? ""}
      alt={alt}
      className={className}
      onError={() => onError?.()}
    />
  ),
}));

import { EntityAvatar } from "../EntityAvatar";

describe("EntityAvatar", () => {
  it("shows the photo in the chosen frame", () => {
    const { container } = render(
      <EntityAvatar
        photo="/goals/1/photo"
        alt="Trip"
        size="xs"
        shape="circle"
        fallbackIcon={faBullseye}
      />,
    );

    expect(screen.getByRole("img", { name: "Trip" })).toHaveAttribute(
      "src",
      "/goals/1/photo",
    );
    expect(container.firstChild).toHaveClass(
      "entity-avatar",
      "entity-avatar--xs",
      "entity-avatar--circle",
    );
    expect(container.firstChild).not.toHaveClass("entity-avatar--fallback");
  });

  it("shows the fallback icon without a photo", () => {
    for (const photo of [null, undefined, "", "   "]) {
      const { container, unmount } = render(
        <EntityAvatar photo={photo} fallbackIcon={faBullseye} />,
      );

      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(container.firstChild).toHaveClass(
        "entity-avatar--md",
        "entity-avatar--rounded",
        "entity-avatar--fallback",
      );
      expect(container.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  it("falls back to the icon when the photo fails to load", () => {
    const { container } = render(
      <EntityAvatar photo="/broken" alt="Broken" fallbackIcon={faBullseye} />,
    );

    fireEvent.error(screen.getByRole("img", { name: "Broken" }));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass("entity-avatar--fallback");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("retries when the photo changes after a failure", () => {
    const { rerender } = render(<EntityAvatar photo="/broken" alt="Photo" />);

    fireEvent.error(screen.getByRole("img", { name: "Photo" }));
    rerender(<EntityAvatar photo="/new" alt="Photo" />);

    expect(screen.getByRole("img", { name: "Photo" })).toHaveAttribute(
      "src",
      "/new",
    );
  });

  it("renders the custom fallback and only shows the badge over a photo", () => {
    const { rerender } = render(
      <EntityAvatar
        photo={null}
        fallback={<span data-testid="custom-fallback" />}
        badge={<span data-testid="badge" />}
      />,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("badge")).not.toBeInTheDocument();

    rerender(
      <EntityAvatar
        photo="/photo"
        alt="Seller"
        fallback={<span data-testid="custom-fallback" />}
        badge={<span data-testid="badge" />}
      />,
    );

    expect(screen.queryByTestId("custom-fallback")).not.toBeInTheDocument();
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });
});
