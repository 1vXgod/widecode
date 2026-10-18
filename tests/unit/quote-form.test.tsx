import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "@/components/quote/quote-form";
import { projectSlugs, type ProjectSlug } from "@/config/projects";
import { getDictionary } from "@/content";
import { emptyQuotePrefill, parseQuotePrefill, type QuotePrefill } from "@/lib/quote-request";
import type { DeliveryMode } from "@/lib/quote-delivery";

const submitQuoteRequest = vi.fn();
vi.mock("@/app/kontakt/actions", () => ({ submitQuoteRequest: (...args: unknown[]) => submitQuoteRequest(...args) }));

const dict = getDictionary();
const copy = { contactPage: dict.contactPage, pricing: dict.pricing, estimator: dict.estimator };
const projectTitles = Object.fromEntries(projectSlugs.map((s) => [s, dict.projects.items[s].title])) as Record<
  ProjectSlug,
  string
>;

function renderForm(prefill: QuotePrefill = emptyQuotePrefill, deliveryMode: DeliveryMode | null = "resend") {
  return render(<QuoteForm prefill={prefill} deliveryMode={deliveryMode} copy={copy} projectTitles={projectTitles} />);
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

  it("labels test mode clearly instead of claiming an email was sent", async () => {
    submitQuoteRequest.mockResolvedValue({ status: "test" });
    const user = userEvent.setup();
    renderForm(emptyQuotePrefill, "log");
    expect(screen.getByText("Mënyrë testimi lokal")).toBeInTheDocument();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Dërgo kërkesën" }));
    expect(await screen.findByRole("heading", { name: "Mënyrë testimi: kërkesa nuk u dërgua me email" })).toBeInTheDocument();
    expect(screen.queryByText("Faleminderit, kërkesa juaj u dërgua!")).not.toBeInTheDocument();
  });

  it.each([
    [{ status: "failed" }, "Kërkesa nuk u dërgua për shkak të një problemi teknik."],
    [{ status: "unavailable" }, "Kërkesa nuk u dërgua, sepse dërgimi i kërkesave"],
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

  it("disables submission when delivery is not configured", () => {
    renderForm(emptyQuotePrefill, "disabled");
    expect(screen.getByText("Formulari nuk është aktiv ende")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dërgo kërkesën" })).toBeDisabled();
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
