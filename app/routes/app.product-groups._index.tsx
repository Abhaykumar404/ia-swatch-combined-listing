import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {useNavigate } from "@remix-run/react";

// import { ChatIcon, LockIcon } from "@shopify/polaris-icons";
import {
  Page,
  Layout,
  Text,
  BlockStack,
  Box,
  EmptyState,
} from "@shopify/polaris";
// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
// import { SetupGuide } from "app/components/SetupGuide/SetupGuide";
// import { ITEMS } from "app/components/SetupGuide/data";
// import { CustomBanner } from "app/components/Banner/Banner";
import { Footer } from "../components/Footer/Footer";
// import EmptyProductGroup from "../../public/assets/icons/empty_productGroup.png";
import { data } from "../components/IndexFilters/data";
import { IndexFilter } from "../components/IndexFilters/IndexFilters";
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

export default function ProductGroups() {
  // const fetcher = useFetcher<typeof action>();

  // const shopify = useAppBridge();
  const navigate = useNavigate();

  return data.length > 0 ? (
    <Page
      fullWidth
      title="Product groups"
      primaryAction={{
        content: "Add groups",
        onAction() {
          navigate("/app/product-groups/create");
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <IndexFilter products={data} />
        </Layout.Section>
      </Layout>
    </Page>
  ) : (
    <Page>
      <Layout>
        <Layout.Section>
          <BlockStack gap={"400"}>
            <Text variant="headingLg" as="h2">
              Product groups
            </Text>
            <Box
              background="bg-surface"
              padding={"400"}
              overflowX="clip"
              overflowY="clip"
              maxWidth="100%"
              borderRadius="200"
            >
              <BlockStack align="center">
                <EmptyState
                  action={{
                    content: "+ Add group",
                    onAction() {
                      navigate("/app/product-groups/create");
                    },
                  }}
                  image={
                    "https://cdn.starapps.studio/images/more_apps/vsk/g_empty.png"
                  }
                >
                  <Text as="p" variant="headingMd" fontWeight="regular">
                    Create product groups, start by connecting different
                    products and show them as variants
                  </Text>
                </EmptyState>
              </BlockStack>
            </Box>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <Footer text="product groups" url={"#"} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
