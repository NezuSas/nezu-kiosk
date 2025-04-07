import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";
import styles from "./Card.module.css";

describe("Card component", () => {
  const title = "Test Card";
  const imageUrl = "https://example.com/image.jpg";

  it("renders with title and image", () => {
    render(<Card title={title} imageUrl={imageUrl} />);

    const cardTitle = screen.getByText(title);
    const img = screen.getByRole("img");

    expect(cardTitle).toBeInTheDocument();
    expect(img).toHaveAttribute("src", imageUrl);
    expect(img).toHaveAttribute("alt", title);
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Card title={title} imageUrl={imageUrl} onClick={handleClick} />);

    const button = screen.getByRole("button", { name: title });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct class names", () => {
    render(<Card title={title} imageUrl={imageUrl} />);

    const button = screen.getByRole("button");
    const img = screen.getByRole("img");
    const heading = screen.getByText(title);

    expect(button).toHaveClass(styles.container);
    expect(img).toHaveClass(styles.image);
    expect(heading).toHaveClass(styles.title);
  });
});
