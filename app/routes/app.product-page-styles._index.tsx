import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

// import { ChatIcon, LockIcon } from "@shopify/polaris-icons";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineGrid,
} from "@shopify/polaris";
// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
// import { SetupGuide } from "app/components/SetupGuide/SetupGuide";
// import { ITEMS } from "app/components/SetupGuide/data";
// import { CustomBanner } from "app/components/Banner/Banner";
// import { data } from "../components/IndexFilters/data";

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
  const navigate = useNavigate();

  return (
    <Page
      title="Product page styles"
      primaryAction={{ content: "Browse more style" }}
      secondaryActions={[{ content: "Manage default styles" }]}
    >
      <Layout>
        <Layout.Section>
          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Text as="span" variant="headingSm">
                  Button with price
                </Text>
                <Button
                  onClick={() => {
                    navigate("/app/product-page-styles/1234/design-editor");
                  }}
                  accessibilityLabel="Customize"
                  variant="secondary"
                >
                  Customize
                </Button>
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section />
        <Layout.Section />
      </Layout>
      {/* <BlockStack gap={"400"}></BlockStack> */}
    </Page>
  );
}
