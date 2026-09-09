import { render, screen } from "@testing-library/react";
import { GhanaSources } from "@/components/ghana/ghana-sources";
import { GHANA_TRAINING_REFERENCES } from "@/lib/ghana";

describe("GhanaSources", () => {
  it("renders every reference as a real outbound gcps.edu.gh link", () => {
    render(<GhanaSources />);

    // The point of this block is that the citations are real and reachable.
    // A reference that silently stopped rendering, or drifted to another host,
    // would leave the page claiming a source it does not actually show.
    expect(GHANA_TRAINING_REFERENCES.length).toBeGreaterThan(0);

    for (const reference of GHANA_TRAINING_REFERENCES) {
      const link = screen.getByRole("link", { name: new RegExp(reference.label, "i") });
      expect(link).toHaveAttribute("href", reference.url);
      expect(reference.url.startsWith("https://gcps.edu.gh/")).toBe(true);
    }
  });

  it("opens citations in a new tab without leaking the referrer opener", () => {
    render(<GhanaSources />);

    for (const reference of GHANA_TRAINING_REFERENCES) {
      const link = screen.getByRole("link", { name: new RegExp(reference.label, "i") });
      expect(link).toHaveAttribute("target", "_blank");
      // rel=noopener matters here specifically: these are third-party tabs.
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  it("drops the per-source notes in compact mode but keeps the links", () => {
    const { rerender } = render(<GhanaSources />);
    expect(screen.getByText(GHANA_TRAINING_REFERENCES[0].note)).toBeInTheDocument();

    rerender(<GhanaSources compact />);
    expect(screen.queryByText(GHANA_TRAINING_REFERENCES[0].note)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: new RegExp(GHANA_TRAINING_REFERENCES[0].label, "i") })
    ).toBeInTheDocument();
  });
});
