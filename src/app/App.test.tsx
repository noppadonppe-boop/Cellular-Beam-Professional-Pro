import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmptyState } from "@/components/states/EmptyState";

describe("project foundation", () => {
  it("renders an honest empty state without calculation results", () => {
    render(<MemoryRouter><EmptyState title="Analysis engine not implemented" description="No results are available." /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Analysis engine not implemented" })).toBeInTheDocument();
    expect(screen.getByText("No results are available.")).toBeInTheDocument();
  });
});
