import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ChatIcon, LockIcon } from "@shopify/polaris-icons";

import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Banner,
  ButtonGroup,
  InlineGrid,
  EmptyState,
  Badge,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { SetupGuide } from "app/components/SetupGuide/SetupGuide";
import { ITEMS } from "app/components/SetupGuide/data";
import { CustomBanner } from "app/components/Banner/Banner";
import { Footer } from "app/components/Footer/Footer";
import EmptyProductGroup from "../../public/assets/icons/empty_productGroup.png";
import { Select } from "../components/Select/Select";
import {
  collectPageStyleOptions,
  displayGroupOptions,
  imageSourceOptions,
  productPageStylesOptions,
  statusOption,
} from "../components/Select/data";
import { CustomFilters } from "../components/Filters/Filters";

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

export default function CreateProductGroup() {
  const [selectedProduct, setSelectedProduct] = useState<any>([]);
  const [status, setStatus] = useState("Active");
  const [displayGroup, setDisplayGroup] = useState("Above product options");
  const [productPageStyle, setProductPageStyle] = useState("Default");
  const [productPageImageSource, setProductPageImageSource] = useState(
    "First product image",
  );
  const [collectionPageStyle, setCollectionPageStyle] = useState("Default");
  const [collectionPageImageSource, setCollectionPageImageSource] = useState(
    "First product image",
  );
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const navigate = useNavigate();
  const handleInputChange = () => {};
  //   const [openResourcePicker, setOpenResourcePicker] = useState(false);

  //   useEffect(() => {
  //     console.log("opened resource picker");
  //     if (openResourcePicker) {
  //       shopify.resourcePicker({ type: "product" });
  //     }
  //   }, [openResourcePicker]);

  const getProductItems = (products) => {
    return products.map((product) => {
      return {
        id: product.id,
        thumbnailSrc: product.images?.[0].originalSrc,
        thumbnailAlt: product.images?.[0].altText,
        title: product.title,
        value: "",
      };
    });
  };

  async function addProduct() {
    const products = await shopify.resourcePicker({
      type: "product",
      action: "add",
      multiple: true,
      filter: { variants: false },
    });
    setSelectedProduct(getProductItems(products));
    console.log("Selected products---->", products);
  }

  const getSelectedIds = () => {
    const initial_products = selectedProduct.map((product) => {
      return { id: product.id };
    });
    console.log(initial_products);
    return initial_products;
  };
  async function openProduct() {
    const selected_products = await shopify.resourcePicker({
      type: "product",
      action: "add",
      multiple: true,
      filter: { variants: false },
      selectionIds: getSelectedIds(),
    });

    if (selected_products) {
      setSelectedProduct([...getProductItems(selected_products)]);
    }
  }

  const getProductPageStyleSubList = () => {
    const results = productPageStylesOptions.find(
      (style) => style.value === productPageStyle,
    );
    return results?.subList;
  };
  const getCollectionPageStyleSubList = () => {
    const results = collectPageStyleOptions.find(
      (style) => style.value === collectionPageStyle,
    );
    return results?.subList;
  };

  return (
    <Page
      title="Create Group"
      titleMetadata={<Badge tone="success">Active</Badge>}
      backAction={{
        content: "",
        onAction() {
          navigate(-1);
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={"400"}>
            <Card>
              <FormLayout>
                <TextField
                  label="Group Name"
                  placeholder="Add a unique name for your reference"
                  type="text"
                  onChange={handleInputChange}
                  name="groupName"
                />
                <TextField
                  label="Option Name"
                  placeholder="Add a name like Color, Style, etc"
                  type="text"
                  onChange={handleInputChange}
                  name="optionName"
                />
              </FormLayout>
            </Card>

            <Box background="bg-surface" padding={"400"} borderRadius="400">
              <BlockStack gap="100">
                <InlineStack
                  align="space-between"
                  gap={"100"}
                  direction={"row"}
                >
                  <Text as="p" variant="headingMd">
                    Products
                  </Text>

                  {selectedProduct && selectedProduct.length > 0 && (
                    <Button variant="plain" onClick={openProduct}>
                      Add Products
                    </Button>
                  )}
                </InlineStack>

                {selectedProduct && selectedProduct.length > 0 ? (
                  <CustomFilters
                    items={selectedProduct}
                    setItems={setSelectedProduct}
                  />
                ) : (
                  <EmptyState
                    action={{
                      content: "Add Product",
                      onAction() {
                        addProduct();
                      },
                    }}
                    image="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/personalized-empty-state-Bu4xlcHV0rQu.svg"
                  >
                    <Text as="p" variant="bodySm">
                      Get started by adding products to this group.
                    </Text>
                  </EmptyState>
                )}
              </BlockStack>
            </Box>
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <BlockStack gap={"400"}>
            <Card background="bg-surface">
              <BlockStack gap={"100"}>
                <Text as="h2" variant="headingSm">
                  Status
                </Text>
                <Select
                  options={statusOption}
                  lableHidden
                  onChange={(selected, id) => {
                    setStatus(selected);
                  }}
                  value={status}
                />
              </BlockStack>
            </Card>
            <Card background="bg-surface">
              <BlockStack gap={"100"}>
                <Text as="h2" variant="headingSm">
                  Display group options
                </Text>
                <Select
                  options={displayGroupOptions}
                  lableHidden
                  onChange={(selected, id) => {
                    setDisplayGroup(selected);
                  }}
                  value={displayGroup}
                />
              </BlockStack>
            </Card>
            <Card background="bg-surface">
              <BlockStack gap={"100"}>
                <Text as="h2" variant="headingSm">
                  Product page style
                </Text>
                <BlockStack gap={"400"}>
                  <Select
                    options={productPageStylesOptions}
                    label="Option style"
                    onChange={(selected, id) => {
                      setProductPageStyle(selected);
                    }}
                    value={productPageStyle}
                  />
                  <Select
                    options={imageSourceOptions}
                    label="Swatch Image Source"
                    disabled={!getProductPageStyleSubList()}
                    onChange={(selected, id) => {
                      setProductPageImageSource(selected);
                    }}
                    value={productPageImageSource}
                  />
                </BlockStack>
              </BlockStack>
            </Card>
            <Card background="bg-surface">
              <BlockStack gap={"100"}>
                <Text as="h2" variant="headingSm">
                  Collection page style
                </Text>
                <BlockStack gap={"400"}>
                  <Select
                    options={collectPageStyleOptions}
                    label="Option style"
                    onChange={(selected, id) => {
                      setCollectionPageStyle(selected);
                    }}
                    value={collectionPageStyle}
                  />
                  <Select
                    options={imageSourceOptions}
                    label="Swatch Image Source"
                    disabled={!getCollectionPageStyleSubList()}
                    onChange={(selected, id) => {
                      setCollectionPageImageSource(selected);
                    }}
                    value={collectionPageImageSource ?? ""}
                  />
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section />
        <Layout.Section />
      </Layout>
    </Page>
  );
}
