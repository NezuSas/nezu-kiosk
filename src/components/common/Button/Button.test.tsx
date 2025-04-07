import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";
import styles from "./Button.module.css";

describe("Button component", () => {
  it("renders correctly with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn(); 
    render(<Button onClick={handleClick}>Press</Button>);
    fireEvent.click(screen.getByText("Press"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies full width class when width is 100%", () => {
    render(<Button width="100%">Full</Button>);
    expect(screen.getByText("Full")).toHaveClass(styles.fullWidth);
  });
});
