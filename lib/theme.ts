import localFont from "@next/font/local";
import { extendTheme } from "@chakra-ui/react";

const akkuratFont = localFont({ src: "./Akkurat-Regular.woff2" });

export const theme = extendTheme({
  fonts: {
    heading: `${akkuratFont.style.fontFamily}, sans-serif`,
    body: `${akkuratFont.style.fontFamily}, sans-serif`,
  },
  styles: {
    global: () => ({
      body: {
        width: "100%",
        height: "100%",
        position: "fixed",
      },
    }),
  },
  colors: {
    red: {
      50: "#FFE0E3",
      100: "#FFC0C6",
      200: "#FF949E",
      300: "#FF6877",
      400: "#FB3C4E",
      500: "#E22C3E",
      600: "#B71928",
      700: "#950D1A",
      800: "#73040E",
    },

    green: {
      50: "#E0FFFA",
      100: "#BAF8EE",
      200: "#82EDDC",
      300: "#49DFC6",
      400: "#1FC3A8",
      500: "#17A089",
      600: "#047F6B",
      700: "#036353",
      800: "#00473C",
    },

    blue: {
      50: "#DBEFFF",
      100: "#B5E0FF",
      200: "#82CBFF",
      300: "#4FB6FF",
      400: "#1CA0FD",
      500: "#0B85DB",
      600: "#006DB9",
      700: "#005997",
      800: "#003C66",
    },

    purple: {
      50: "#F3E0FF",
      100: "#E7BDFF",
      200: "#CF86F9",
      300: "#BE52FA",
      400: "#9620D8",
      500: "#7A10B6",
      600: "#600494",
      700: "#490072",
      800: "#330050",
    },

    orange: {
      50: "#FB501D",
      100: "#DF491E",
    },
  },
  semanticTokens: {
    colors: {
      gradient: "linear-gradient(90deg, #fb3c4e 0%, #fb2491 100%)",
    },
  },
  components: {
    Menu: {
      parts: ["item"],
      baseStyle: {
        item: {
          background: "#383838",
          _focus: {
            background: "transparent",
          },
          _active: {
            background: "rgba(0,0,0,0.5)",
          },
        },
      },
    },
  },
});
