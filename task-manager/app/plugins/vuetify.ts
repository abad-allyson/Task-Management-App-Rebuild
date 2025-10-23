// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      VTextField: {
        variant: "outlined",
        density: "comfortable",
      },
      VTextarea: {
        variant: "outlined",
        density: "comfortable",
      },
      VDateInput: {
        variant: "outlined",
        density: "comfortable",
      },
    },
  });
  app.vueApp.use(vuetify);
});
