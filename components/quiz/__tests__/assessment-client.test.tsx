import { render, screen, fireEvent, within } from "@testing-library/react";
import { AssessmentClient } from "@/components/quiz/assessment-client";

// The component calls useRouter at render; stub it.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() })
}));

describe("AssessmentClient — A11Y-1 keyboard radios", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("uses roving tabindex: only the selected option is tabbable", () => {
    render(<AssessmentClient />);
    const group = screen.getByRole("radiogroup", { name: /education stage/i });
    const radios = within(group).getAllByRole("radio");

    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("tabindex", "0");
    expect(radios[1]).toHaveAttribute("tabindex", "-1");
    expect(radios[2]).toHaveAttribute("tabindex", "-1");
  });

  it("moves selection and focus with ArrowDown (wrapping)", () => {
    render(<AssessmentClient />);
    const group = screen.getByRole("radiogroup", { name: /education stage/i });
    const radios = within(group).getAllByRole("radio");

    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: "ArrowDown" });

    expect(radios[1]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
    expect(radios[1]).toHaveAttribute("tabindex", "0");
    expect(radios[1]).toHaveFocus();
  });

  it("selects the focused option with Space", () => {
    render(<AssessmentClient />);
    const group = screen.getByRole("radiogroup", { name: /education stage/i });
    const radios = within(group).getAllByRole("radio");

    fireEvent.keyDown(radios[2], { key: " " });

    expect(radios[2]).toHaveAttribute("aria-checked", "true");
  });
});
