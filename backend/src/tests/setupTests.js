import { jest } from "@jest/globals";

await jest.unstable_mockModule(
  "../middlewares/authMiddleware.js",
  () => import("./__mocks__/authMiddleware.mock.js")
);

await jest.unstable_mockModule(
  "../middlewares/authorizeRole.js",
  () => import("./__mocks__/authorizeRole.mock.js")
);

await jest.unstable_mockModule(
  "../controllers/postController.js",
  () => import("./__mocks__/postController.mock.js")
);
