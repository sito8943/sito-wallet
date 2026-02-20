import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";

interface WrapperOptions {
  routerProps?: MemoryRouterProps;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function TestProviders({
  children,
  queryClient,
  routerProps,
}: {
  children: ReactNode;
  queryClient: QueryClient;
  routerProps?: MemoryRouterProps;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: WrapperOptions & Omit<RenderOptions, "wrapper">
) {
  const queryClient = createTestQueryClient();
  const { routerProps, ...renderOptions } = options ?? {};

  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient} routerProps={routerProps}>
          {children}
        </TestProviders>
      ),
      ...renderOptions,
    }),
    queryClient,
  };
}

/** Flush all pending promises (microtasks) */
export const flushPromises = () =>
  new Promise((resolve) => setTimeout(resolve, 0));
