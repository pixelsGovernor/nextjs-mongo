import React, { useContext } from "react";
import { render } from "@testing-library/react";
import HomePage from "../pages/index.js";
import { StoreProvider } from '../utils/Store';


describe("HomePage", () => {
  it("should render the heading", () => {
    /*
    const HomePage = dynamic(
      () => import('../pages/index'),
      { ssr: false }
    )*/

    const { getByTestId } = render(
      <StoreProvider>
        <HomePage />
      </StoreProvider>
      );
    expect(getByTestId('layout'));
  });
});
