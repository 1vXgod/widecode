import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";
import { getDictionary } from "@/content";
import { errorPage } from "@/content/sq/error-page";

describe("error page", () => {
  it("is part of the dictionary, so a future locale has to translate it", () => {
    expect(getDictionary("sq").errorPage).toBe(errorPage);
  });

  it("explains the problem in Albanian and offers a retry and a way home", async () => {
    const retry = vi.fn();
    render(<ErrorPage error={new Error("boom")} retry={retry} />);

    expect(screen.getByRole("heading", { level: 1, name: "Diçka shkoi keq" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kthehu në ballinë" })).toHaveAttribute("href", "/");
    await userEvent.click(screen.getByRole("button", { name: "Provo përsëri" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("never shows the error message, only the reference code of a server error", () => {
    const error = Object.assign(new Error("database password rejected"), { digest: "2914573826" });
    render(<ErrorPage error={error} retry={() => undefined} />);

    expect(document.body).not.toHaveTextContent("database password");
    expect(screen.getByText("2914573826")).toBeInTheDocument();
  });

  it("handles thrown values that are not errors", () => {
    render(<ErrorPage error="plain string" retry={() => undefined} />);
    expect(document.body).not.toHaveTextContent("plain string");
    expect(screen.queryByText(/Kodi i gabimit/)).not.toBeInTheDocument();
  });
});
