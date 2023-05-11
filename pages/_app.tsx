import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { theme } from "lib/theme";
import { UserProvider } from "context/User";
import { SpaceProvider } from "context/Space";
import { UserMediaProvider } from "context/UserMedia";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <UserMediaProvider>
            <SpaceProvider>
              <Component {...pageProps} />
            </SpaceProvider>
          </UserMediaProvider>
        </UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
