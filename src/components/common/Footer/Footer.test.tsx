import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import type { FooterProps } from "./Footer.types";

describe("Footer component", () => {
  const mockProps: FooterProps = {
    logo: "/logo.png",
    slogan: "Somos tecnología para todos",
    contact: "contacto@nezu.com",
    location: "Ciudad, País",
    branchName: "Sucursal Central",
  };

  it("renders the logo", () => {
    render(<Footer {...mockProps} />);
    const logoImg = screen.getByAltText("Logo");
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute("src", mockProps.logo);
  });

  it("renders slogan and branch name", () => {
    render(<Footer {...mockProps} />);
    expect(screen.getByText(mockProps.slogan)).toBeInTheDocument();
    expect(
      screen.getByText(`Sucursal: ${mockProps.branchName}`)
    ).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<Footer {...mockProps} />);
    expect(screen.getByText(mockProps.contact)).toBeInTheDocument();
  });

  it("renders location information", () => {
    render(<Footer {...mockProps} />);
    expect(screen.getByText(mockProps.location)).toBeInTheDocument();
  });

  it("renders custom className if provided", () => {
    render(<Footer {...mockProps} className="custom-class" />);
    const footer = screen.getByRole("contentinfo"); // si agregas role
    expect(footer.className).toMatch(/custom-class/);
  });
});