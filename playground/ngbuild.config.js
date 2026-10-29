export default {
  plugins: [
    {
      name: 'ngbuild-example-plugin',

      config(context) {
        console.log(
          `[Example Plugin] Config: ${context.mode}`
        );
      },

      buildStart(context) {
        console.log(
          `[Example Plugin] Build started: ${context.mode}`
        );
      },

      transform(code, id, context) {
        if (id.endsWith('app.tsx')) {
          console.log(
            `[Example Plugin] Transform: ${id} (${context.mode})`
          );
        }

        return code;
      }
    }
  ]
};