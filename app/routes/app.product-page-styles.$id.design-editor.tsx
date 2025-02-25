import { useCallback, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import {
  DesktopIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  InlineStack,
  ButtonGroup,
  InlineGrid,
  Icon,
  Divider,
  Scrollable,
} from "@shopify/polaris";
// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
// import { SetupGuide } from "app/components/SetupGuide/SetupGuide";
// import { ITEMS } from "app/components/SetupGuide/data";
// import { CustomBanner } from "app/components/Banner/Banner";
import { CollapsibleCard } from "../components/CollapsibleCard/index";

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
  const [activeWindowButtonIndex, setActiveWindowButtonIndex] = useState(0);
  const [activeTextButtonIndex, setActiveTextButtonIndex] = useState(0);

  const handleWindowButtonClick = useCallback(
    (index: number) => {
      if (activeWindowButtonIndex === index) return;
      setActiveWindowButtonIndex(index);
    },
    [activeWindowButtonIndex],
  );

  const handleTextButtonClick = useCallback(
    (index: number) => {
      if (activeTextButtonIndex === index) return;
      setActiveTextButtonIndex(index);
    },
    [activeTextButtonIndex],
  );

  const navigate = useNavigate();

  return (
    <Page
      title="Customize"
      backAction={{
        content: "",
        onAction() {
          navigate(-1);
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <Box
            background="bg-surface"
            minHeight="100%"
            overflowX="clip"
            overflowY="clip"
            borderRadius="300"
          >
            <BlockStack gap={"025"}>
              <div style={{ padding: "10px 24px" }}>
                <InlineGrid
                  columns={["twoThirds", "oneThird"]}
                  alignItems="center"
                >
                  <Text as="span" variant="headingSm">
                    Button with price
                  </Text>
                  <InlineStack direction={"row"} gap={"500"}>
                    <ButtonGroup variant="segmented">
                      <Button
                        pressed={activeWindowButtonIndex === 0}
                        onClick={() => handleWindowButtonClick(0)}
                      >
                        <Icon source={DesktopIcon} tone="base" />
                      </Button>
                      <Button
                        pressed={activeWindowButtonIndex === 1}
                        onClick={() => handleWindowButtonClick(1)}
                      >
                        <Icon source={MobileIcon} tone="base" />
                      </Button>
                    </ButtonGroup>
                    <ButtonGroup variant="segmented">
                      <Button
                        pressed={activeTextButtonIndex === 0}
                        onClick={() => handleTextButtonClick(0)}
                      >
                        Long Text
                      </Button>
                      <Button
                        pressed={activeTextButtonIndex === 1}
                        onClick={() => handleTextButtonClick(1)}
                      >
                        Short Text
                      </Button>
                    </ButtonGroup>
                  </InlineStack>
                </InlineGrid>
              </div>
              <Divider borderColor="border-secondary" borderWidth="025" />
              <InlineGrid columns={["oneThird", "twoThirds"]}>
                <Scrollable style={{ height: "70vh" }}>
                  <CollapsibleCard title="Selected Button" />
                  <CollapsibleCard title="Unselected Button" />
                  <CollapsibleCard title="Hover Settings" />
                  <CollapsibleCard title="Button Style Settings" />
                </Scrollable>
                <div
                  style={{
                    padding: "1rem 5rem 2rem 5rem",
                  }}
                >
                  <BlockStack gap={"500"}>
                    <Text as="strong" variant="headingSm">
                      Preview
                    </Text>
                    <Card></Card>
                  </BlockStack>
                </div>
              </InlineGrid>
            </BlockStack>
          </Box>
        </Layout.Section>
        <Layout.Section />
        <Layout.Section />
      </Layout>
      {/* <BlockStack gap={"400"}></BlockStack> */}
    </Page>
  );
}
