import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "@/components/quote/quote-form";
import { projectSlugs, type ProjectSlug } from "@/config/projects";
import { getDictionary } from "@/content";
import { emptyQuotePrefill, parseQuotePrefill, type QuotePrefill } from "@/lib/quote-request";

const submitQuoteRequest = vi.fn();
vi.mock("@/app/[lang]/kontakt/actions", () => ({ submitQuoteRequest: (...args: unknown[]) => submitQuoteRequest(...args) }));

const dict = getDictionary();
const copy = { contactPage: dict.contactPage, pricing: dict.pricing, estimator: dict.estimator };
const projectTitles = Object.fromEntries(projectSlugs.map((s) => [s, dict.projects.items[s].title])) as Record<
  ProjectSlug,
  string
>;

function renderForm(prefill: QuotePrefill = emptyQuotePrefill, available: boolean | null = true) {
  return render(<QuoteForm prefill={prefill} available={available} keepDraft copy={copy} projectTitles={projectTitles} />);
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Emri dhe mbiemri"), "Arta Krasniqi");
  await user.type(screen.getByLabelText("Email"), "arta@example.com");
  await user.selectOptions(screen.getByLabelText("Lloji i projektit"), "business");
  await user.selectOptions(screen.getByLabelText("Paketa"), "business");
  await user.selectOptions(screen.getByLabelText("Buxheti i përafërt"), "300-600");
  await user.selectOptions(screen.getByLabelText("Afati i dëshiruar"), "flexible");
  await user.type(screen.getByLabelText("Përshkrimi i projektit"), "Website për restorantin me menu dhe rezervime.");
}

beforeEach(() => {
  submitQuoteRequest.mockReset();
  // The form keeps a draft in sessionStorage; every test starts without one.
  window.sessionStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
});

describe("QuoteForm", () => {
  it("shows an error summary and inline errors, and does not submit invalid data", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));

    expect(await screen.findByText("Ju lutemi korrigjoni 7 fusha:")).toBeInTheDocument();
    const name = screen.getByLabelText("Emri dhe mbiemri");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Shkruani emrin tuaj.");
    expect(document.activeElement).toHaveAttribute("id", "quote-error-summary");
    expect(submitQuoteRequest).not.toHaveBeenCalled();

    // Errors update live once the visitor starts correcting.
    await user.type(name, "Arta");
    expect(name).not.toHaveAttribute("aria-invalid");
    expect(screen.getByText("Ju lutemi korrigjoni 6 fusha:")).toBeInTheDocument();
  });

  it("links summary errors to their fields", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    await user.click(screen.getByRole("link", { name: "Shkruani adresën tuaj të email-it." }));
    await waitFor(() => expect(screen.getByLabelText("Email")).toHaveFocus());
  });

  it("submits valid data and shows the confirmation only when the request was sent", async () => {
    submitQuoteRequest.mockResolvedValue({ status: "sent" });
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));

    const heading = await screen.findByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByText(/do t'ju kthejmë përgjigje në arta@example.com/)).toBeInTheDocument();

    const [payload] = submitQuoteRequest.mock.calls[0] as [Record<string, unknown>];
    expect(payload).toMatchObject({
      values: { name: "Arta Krasniqi", email: "arta@example.com", packageId: "business" },
      website: "",
      estimate: null,
      projectSlug: null,
    });
    expect(payload.submissionId).toEqual(expect.any(String));
  });

  it("never mentions testing or the server console to visitors", async () => {
    const all = JSON.stringify(dict.contactPage).toLowerCase();
    for (const word of ["testim", "test mode", "konsol", "console", "resend", "zhvillim"]) {
      expect(all, word).not.toContain(word);
    }
    // Any status other than "sent" leaves the form in place, without a confirmation.
    submitQuoteRequest.mockResolvedValue({ status: "unavailable" });
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Faleminderit, kërkesa juaj u dërgua!")).not.toBeInTheDocument();
  });

  it.each([
    [{ status: "failed" }, "Kërkesa nuk u dërgua për shkak të një problemi teknik."],
    [{ status: "unavailable" }, "Kërkesa nuk u dërgua, sepse formulari është përkohësisht i padisponueshëm"],
    [{ status: "rejected" }, "Kërkesa nuk mund të pranohej"],
    [{ status: "rateLimited", retryAfterSeconds: 300 }, "provoni përsëri pas 5 minutash"],
    [{ status: "rateLimited", retryAfterSeconds: 20 }, "provoni përsëri pas 1 minute"],
    [{ status: "tooFast" }, "Formulari u dërgua shumë shpejt"],
  ])("keeps the data and explains %o", async (result, message) => {
    submitQuoteRequest.mockResolvedValue(result);
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.getByLabelText("Emri dhe mbiemri")).toHaveValue("Arta Krasniqi");
  });

  it("handles a network failure without losing the data", async () => {
    submitQuoteRequest.mockRejectedValue(new TypeError("Failed to fetch"));
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Nuk u lidhëm dot me serverin");
    expect(screen.getByLabelText("Email")).toHaveValue("arta@example.com");
  });

  it("shows server-side field errors", async () => {
    submitQuoteRequest.mockResolvedValue({ status: "invalid", errors: { email: "invalid" } });
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    expect(await screen.findByText("Ju lutemi korrigjoni 1 fushë:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a professional unavailable message instead of the form when delivery is not configured", () => {
    renderForm(emptyQuotePrefill, false);
    expect(
      screen.getByRole("heading", { name: "Formulari është përkohësisht i padisponueshëm" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dërgo kërkesën" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shiko çmimet" })).toHaveAttribute("href", "/cmimet");
  });

  it("pre-fills from an estimator link and sends the estimate choices", async () => {
    submitQuoteRequest.mockResolvedValue({ status: "sent" });
    const user = userEvent.setup();
    renderForm(parseQuotePrefill(new URLSearchParams("paketa=business&faqe=7&shtesa=blog&projekti=klinike-dentare")));

    expect(screen.getByLabelText("Paketa")).toHaveValue("business");
    expect(screen.getByLabelText("Lloji i projektit")).toHaveValue("business");
    expect(screen.getByText("Klinikë dentare")).toBeInTheDocument();
    expect(screen.getByTestId("quote-estimate-total").textContent?.replace(/\s/g, " ")).toBe("nga 559 €");

    await user.type(screen.getByLabelText("Emri dhe mbiemri"), "Arta Krasniqi");
    await user.type(screen.getByLabelText("Email"), "arta@example.com");
    await user.selectOptions(screen.getByLabelText("Buxheti i përafërt"), "300-600");
    await user.selectOptions(screen.getByLabelText("Afati i dëshiruar"), "flexible");
    await user.type(screen.getByLabelText("Përshkrimi i projektit"), "Website për klinikën me terminet online.");
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    await screen.findByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" });

    expect(submitQuoteRequest.mock.calls[0]?.[0]).toMatchObject({
      estimate: { pages: 7, addOns: ["blog"] },
      projectSlug: "klinike-dentare",
    });
  });

  it("shows the complete configuration: pages, included features, add-ons and the estimated total", () => {
    renderForm(parseQuotePrefill(new URLSearchParams("paketa=professional&faqe=12&shtesa=multilingual,booking&vleresim=1")));
    const card = screen.getByText("Vlerësimi juaj nga llogaritësi").parentElement!.parentElement!;
    const text = card.textContent!.replace(/\s/g, " ");
    expect(text).toContain("Numri i faqeve12 faqe (10 të përfshira në paketë)");
    expect(text).toContain("Të përfshira në paketëBlog / lajme dhe Analitikë");
    expect(text).toContain("Website në dy gjuhë");
    expect(text).toContain("Rezervime ose takime");
    expect(screen.getByTestId("quote-estimate-total").textContent?.replace(/\s/g, " ")).toBe("nga 1109 €");
    expect(text).toContain("Çmimin përfundimtar e konfirmojmë në ofertë.");
    expect(screen.getByRole("link", { name: "Ndrysho vlerësimin" })).toHaveAttribute(
      "href",
      "/llogarit-cmimin?paketa=professional&faqe=12&shtesa=multilingual%2Cbooking",
    );
  });

  it("takes a changed estimate from the URL without losing what the visitor typed", async () => {
    const user = userEvent.setup();
    const props = { available: true, keepDraft: true, copy, projectTitles };
    const { rerender } = render(
      <QuoteForm {...props} prefill={parseQuotePrefill(new URLSearchParams("paketa=business&faqe=7&shtesa=analytics"))} />,
    );
    await user.type(screen.getByLabelText("Emri dhe mbiemri"), "Arta Krasniqi");
    expect(screen.getByTestId("quote-estimate-total").textContent?.replace(/\s/g, " ")).toBe("nga 499 €");

    // Back from the estimator with more pages and booking: the same form instance gets a new URL.
    rerender(
      <QuoteForm
        {...props}
        prefill={parseQuotePrefill(new URLSearchParams("paketa=business&faqe=8&shtesa=booking,analytics&vleresim=1"))}
      />,
    );
    expect(screen.getByTestId("quote-estimate-total").textContent?.replace(/\s/g, " ")).toBe("nga 729 €");
    expect(screen.getByText("Rezervime ose takime")).toBeInTheDocument();
    expect(screen.getByLabelText("Emri dhe mbiemri")).toHaveValue("Arta Krasniqi");
  });

  it("restores an unsent draft after a refresh and clears it once the request is sent", async () => {
    submitQuoteRequest.mockResolvedValue({ status: "sent" });
    const user = userEvent.setup();
    const prefill = parseQuotePrefill(new URLSearchParams("paketa=business&faqe=7&vleresim=1"));
    const first = renderForm(prefill);
    await user.type(screen.getByLabelText("Emri dhe mbiemri"), "Arta Krasniqi");
    await user.type(screen.getByLabelText("Email"), "arta@example.com");
    first.unmount();

    // A fresh form (refresh) opened from the same link.
    renderForm(prefill);
    expect(screen.getByLabelText("Emri dhe mbiemri")).toHaveValue("Arta Krasniqi");
    expect(screen.getByLabelText("Email")).toHaveValue("arta@example.com");
    expect(screen.getByTestId("quote-estimate-total").textContent?.replace(/\s/g, " ")).toBe("nga 459 €");

    await user.selectOptions(screen.getByLabelText("Buxheti i përafërt"), "300-600");
    await user.selectOptions(screen.getByLabelText("Afati i dëshiruar"), "flexible");
    await user.type(screen.getByLabelText("Përshkrimi i projektit"), "Website për restorantin me menu dhe rezervime.");
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    await screen.findByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" });
    expect(window.sessionStorage.getItem("widecode:quote-draft")).toBeNull();
  });

  it("the prerendered placeholder form never reads or overwrites the visitor's draft", async () => {
    const user = userEvent.setup();
    const stored = JSON.stringify({ values: { name: "Arta Krasniqi" }, estimate: null, projectSlug: null });
    window.sessionStorage.setItem("widecode:quote-draft", stored);
    render(<QuoteForm prefill={emptyQuotePrefill} available={null} copy={copy} projectTitles={projectTitles} />);
    expect(screen.getByLabelText("Emri dhe mbiemri")).toHaveValue("");
    await user.type(screen.getByLabelText("Email"), "x@example.com");
    expect(window.sessionStorage.getItem("widecode:quote-draft")).toBe(stored);
  });

  it("drops the estimate when another package is chosen or it is removed", async () => {
    const user = userEvent.setup();
    renderForm(parseQuotePrefill(new URLSearchParams("paketa=business&faqe=7")));
    expect(screen.getByTestId("quote-estimate-total")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Paketa"), "ecommerce");
    expect(screen.queryByTestId("quote-estimate-total")).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Paketa"), "business");
    expect(screen.getByTestId("quote-estimate-total")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Hiq vlerësimin" }));
    expect(screen.queryByTestId("quote-estimate-total")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Paketa")).toHaveFocus());
  });
});
