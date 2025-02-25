import {
  BlockStack,
  Box,
  Card,
  Collapsible,
  Icon,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import { useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon } from "@shopify/polaris-icons";
import ColorPickerComponent from "../ColorPicker/ColorPicker";
import "./CollapsibleCard.module.css";

interface CollapsibleCardProps {
  title: string;
}
export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: ".01rem solid rgba(225, 227, 229, 1)" }}>
      <div>
        <Box>
          <div
            style={{
              height: "3rem",
              display: "grid",
              gridTemplateColumns: "1fr auto 0",
              alignItems: "center",
              paddingLeft: "1.6rem",
              paddingRight: "1.2rem",
              margin: "0px !important",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <InlineGrid columns={"1fr auto"}>
              <Text as="strong" variant="bodyMd">
                {title}
              </Text>
              <Icon source={open ? ChevronDownIcon : ChevronLeftIcon} />
            </InlineGrid>
          </div>
          <Collapsible
            open={open}
            transition
            id={crypto.randomUUID()}
            expandOnPrint
          >
            <div style={{ padding: "1rem 1.6rem 1rem 1.6rem" }}>
              <BlockStack gap={"400"}>
                <ColorPickerComponent
                  label={"Border Color"}
                  onChange={""}
                  currentHexColor={"FFF"}
                />
                <ColorPickerComponent
                  label={"Variant Name"}
                  onChange={""}
                  currentHexColor={"FFF"}
                />
                <ColorPickerComponent
                  label={"Price"}
                  onChange={""}
                  currentHexColor={"FFF"}
                />
              </BlockStack>
            </div>
          </Collapsible>
        </Box>
      </div>
    </div>
  );
};
