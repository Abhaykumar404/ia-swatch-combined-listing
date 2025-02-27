import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import { ChatIcon, LockIcon } from "@shopify/polaris-icons";
import {
  Page,
  Layout,
  Text,
  Button,
  BlockStack,
  Box,
  InlineStack,
  ButtonGroup,
  InlineGrid,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { SetupGuide } from "../components/SetupGuide/SetupGuide";
import { ITEMS } from "../components/SetupGuide/data";
import { CustomBanner } from "../components/Banner/Banner";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
  });
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const [showGuide, setShowGuide] = useState(true);
  const [items, setItems] = useState(ITEMS);

  // Example of step complete handler, adjust for your use case
  const onStepComplete = async (id: any) => {
    try {
      // Simulate API call delay
      await new Promise<void>((res) => setTimeout(res, 1000));

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, complete: !item.complete } : item
        )
      );
    } catch (e) {
      console.error(e);
    }
  };


  if (!showGuide)
    return <Button onClick={() => setShowGuide(true)}>Show Setup Guide</Button>;
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });
  const handleDismiss = () => {
    //Implement Dismiss Functionality
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <InlineStack gap={"300"}>
            <BlockStack>
              <Text as="h4">Hello, John Doe</Text>
              <Text as="p">
                Welcome to <strong>Swatch King</strong> handcrafted by StartApps
              </Text>
            </BlockStack>
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          <CustomBanner
            title="Howdy partners!"
            tone="info"
            onDismiss={handleDismiss}
          >
            <Text as="span">
              We're glad you're using our app for your client store. If you
              require any assistance with the customization or have anything to
              say to us, write back to us and we'll be more than happy to listen
              and serve you with an appropriate solution right away. Not to
              mention, we offer priority support for partners.
            </Text>
          </CustomBanner>
        </Layout.Section>
        <Layout.Section>
          <CustomBanner
            title="Your online store is password protected!"
            tone="warning"
            iconSource={LockIcon}
            onDismiss={handleDismiss}
          >
            <BlockStack align="space-between" gap={"200"}>
              <Text as="span">
                Please share your online store password so our team can access
                your store and support you better.
              </Text>
              <ButtonGroup>
                <Button size="medium" textAlign="center" variant="secondary">
                  Add Password
                </Button>
              </ButtonGroup>
            </BlockStack>
          </CustomBanner>
        </Layout.Section>
        <Layout.Section>
          <div className="setup-guide">
            <div className="max-w-[60rem] m-auto">
              <SetupGuide
                onDismiss={() => {
                  setShowGuide(false);
                  setItems(ITEMS);
                }}
                onStepComplete={onStepComplete}
                items={items}
              />
            </div>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Box>
            <InlineGrid columns={3} gap={"200"}>
              <Box
                minHeight="100%"
                overflowX="clip"
                overflowY="clip"
                background="bg-surface"
                borderRadius="300"
                padding={"400"}
              >
                <BlockStack gap={"200"}>
                  <Text variant="bodyMd" as="h2">
                    Active Products
                  </Text>
                  <InlineStack direction={"row"} wrap>
                    <InlineStack
                      align="end"
                      wrap
                      gap={"100"}
                      direction={"row"}
                      blockAlign="center"
                    >
                      <Text variant="headingLg" as="span">
                        13
                      </Text>
                      <Text variant="bodySm" as="span" breakWord>
                        / 16 total products
                      </Text>
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
              </Box>

              <Box
                minHeight="100%"
                overflowX="clip"
                overflowY="clip"
                background="bg-surface"
                borderRadius="300"
                padding={"400"}
              >
                <BlockStack gap={"200"}>
                  <Text variant="bodyMd" as="h2">
                    Shopify Options
                  </Text>

                  <Text variant="headingLg" as="span">
                    13
                  </Text>
                </BlockStack>
              </Box>

              <Box
                minHeight="100%"
                overflowX="clip"
                overflowY="clip"
                background="bg-surface"
                borderRadius="300"
                padding={"400"}
              >
                <BlockStack gap={"200"}>
                  <Text variant="bodyMd" as="h2">
                    Active groups
                  </Text>

                  <Text variant="headingLg" as="span">
                    --
                  </Text>
                </BlockStack>
              </Box>
            </InlineGrid>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <InlineGrid columns={2} gap={"200"}>
            <Box
              minHeight="100%"
              overflowX="clip"
              overflowY="clip"
              background="bg-surface"
              borderRadius="300"
              padding={"400"}
            >
              <BlockStack gap={"200"}>
                <InlineStack align="start" wrap gap={"200"} direction={"row"}>
                  <Text variant="headingSm" as="h2">
                    Current plan
                  </Text>
                </InlineStack>
                <Text variant="bodyMd" as="p">
                  You are currently on a monthly plan
                </Text>
              </BlockStack>
            </Box>
            <Box
              minHeight="100%"
              overflowX="clip"
              overflowY="clip"
              background="bg-surface"
              borderRadius="300"
              padding={"400"}
            >
              <BlockStack gap={"200"}>
                <InlineGrid>
                  <Text variant="headingSm" as="h2">
                    Need help setting up your app?
                  </Text>
                </InlineGrid>
                <Text variant="bodyMd" as="p">
                  Our support team is ready to help with our in-app live chat.
                </Text>
                <InlineStack align="start" wrap gap={"200"} direction={"row"}>
                  <Button variant="secondary" icon={ChatIcon}>
                    Chat with us
                  </Button>
                </InlineStack>
              </BlockStack>
            </Box>
          </InlineGrid>
        </Layout.Section>
        <Layout.Section />
        <Layout.Section />
      </Layout>
      {/* <BlockStack gap={"400"}></BlockStack> */}
    </Page>
  );
}
