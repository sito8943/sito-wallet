import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

const language = vi.hoisted(() => ({ current: "es" }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: { language: language.current } }),
}));

const { Money } = await import("../Money");

const euro = { name: "Euro", symbol: "€" };

describe("Money", () => {
  it("formats the amount in the app language next to the symbol", () => {
    language.current = "es";
    const { container, rerender } = render(
      <Money amount={1234.5} currency={euro} />,
    );
    expect(container).toHaveTextContent("1.234,50 €");

    language.current = "en";
    rerender(<Money amount={1234.5} currency={euro} />);
    expect(container).toHaveTextContent("1,234.50 €");
  });

  it("keeps the currency name as tooltip", () => {
    const { getByText } = render(<Money amount={1} currency={euro} />);
    expect(getByText("€")).toHaveAttribute("data-tooltip-content", "Euro");
  });

  it("shows a placeholder while loading", () => {
    const { container } = render(<Money amount={10} currency={euro} loading />);
    expect(container).toHaveTextContent("… €");
  });
});
