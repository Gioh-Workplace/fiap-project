import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { render } from "@testing-library/react";
import { theme } from "../styles/theme";

export function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </MemoryRouter>
  );
}