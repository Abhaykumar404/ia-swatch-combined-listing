import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setGroupName,
  setOptionName,
  setSelectedProduct,
  setStatus,
  setDisplayGroup,
  setProductPageStyle,
  setProductPageImageSource,
  setCollectionPageStyle,
  setCollectionPageImageSource,
} from "../store/slices/swatch-slice";
import {
  Page,
  Layout,
  Card,
  Button,
  TextField,
  Badge,
  BlockStack,
  Box,
  InlineStack,
  EmptyState,
  Text,
  FormLayout,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Select } from "../components/Select/Select";
import { CustomFilters } from "../components/Filters/Filters";
import {
  collectPageStyleOptions,
  displayGroupOptions,
  imageSourceOptions,
  productPageStylesOptions,
  statusOption,
} from "../components/Select/data";

export default function CreateProductGroup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const {
    groupName,
    optionName,
    selectedProduct,
    status,
    displayGroup,
    productPageStyle,
    productPageImageSource,
    collectionPageStyle,
    collectionPageImageSource,
  } = useSelector((state) => state.swatch);

  const handleInputChange = (field, value) => {
    switch (field) {
      case "groupName":
        dispatch(setGroupName(value));
        break;
      case "optionName":
        dispatch(setOptionName(value));
        break;
    }
  };

  const getProductItems = (products) => {
    return products.map((product) => ({
      id: product.id,
      thumbnailSrc: product.images?.[0].originalSrc,
      thumbnailAlt: product.images?.[0].altText,
      title: product.title,
    }));
  };

  async function addProduct() {
    const products = await shopify.resourcePicker({
      type: "product",
      action: "add",
      multiple: true,
      filter: { variants: false },
    });
    dispatch(setSelectedProduct(getProductItems(products)));
  }

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
          <BlockStack gap="400">
            <Card>
              <FormLayout>
                <TextField
                  label="Group Name"
                  value={groupName}
                  onChange={(value) => handleInputChange("groupName", value)}
                  autoComplete="off"
                />
                <TextField
                  label="Option Name"
                  value={optionName}
                  onChange={(value) => handleInputChange("optionName", value)}
                  autoComplete="off"
                />
              </FormLayout>
            </Card>

            <Box background="bg-surface" padding="400" borderRadius="400">
              <BlockStack gap="100">
                <InlineStack align="space-between" gap="100" direction="row">
                  <Text as="p" variant="headingMd">
                    Products
                  </Text>
                  {selectedProduct.length > 0 && (
                    <Button variant="plain" onClick={addProduct}>
                      Add Products
                    </Button>
                  )}
                </InlineStack>
                {selectedProduct.length > 0 ? (
                  <CustomFilters
                    items={selectedProduct}
                    setItems={(items) => dispatch(setSelectedProduct(items))}
                  />
                ) : (
                  <EmptyState
                    action={{ content: "Add Product", onAction: addProduct }}
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
                  value={status}
                  onChange={(value) => dispatch(setStatus(value))}
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
                  value={displayGroup}
                  onChange={(value) => dispatch(setDisplayGroup(value))}
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
                    value={productPageStyle}
                    onChange={(value) => dispatch(setProductPageStyle(value))}
                  />
                  <Select
                    disabled
                    options={imageSourceOptions}
                    value={productPageImageSource}
                    onChange={(value) =>
                      dispatch(setProductPageImageSource(value))
                    }
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
                    value={collectionPageStyle}
                    onChange={(value) =>
                      dispatch(setCollectionPageStyle(value))
                    }
                  />
                  <Select
                    disabled
                    options={imageSourceOptions}
                    value={collectionPageImageSource}
                    onChange={(value) =>
                      dispatch(setCollectionPageImageSource(value))
                    }
                  />
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
