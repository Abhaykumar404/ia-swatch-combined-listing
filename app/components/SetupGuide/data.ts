export const ITEMS = [
  {
    id: 0,
    title: "Activate app",
    description: "Enable app embed to run the app on themes of your choice",

    complete: false,
    primaryButton: {
      content: "Enable app embed",
    },
  },
  {
    id: 1,
    title: "Configure shopify variants",
    description: "Choose how you want to show variants in your store.",

    complete: false,
    primaryButton: {
      content: "Configure variants",
      props: {
        onAction: () => console.log("copied store link!"),
      },
    },
  },
  {
    id: 2,
    title: "Create product groups",
    description: "Connect different products and show them as variants",

    complete: false,
    primaryButton: {
      content: "Add group",
    },
  },
  // {
  //   id: 3,
  //   title: "Design product page styles",
  //   description:
  //     "Explore product page styles and personalize the look of swatches, buttons and dropdowns for product pages",

  //   complete: false,
  //   primaryButton: {
  //     content: "Customize styles",
  //   },
  // },
  // {
  //   id: 4,
  //   title: "Design collections page styles",
  //   description:
  //     "Explore collection page styles and personalize the look of swatches, buttons and dropdowns for collection pages",

  //   complete: false,
  //   primaryButton: {
  //     content: "Customize styles",
  //   },
  // },
];
