import { ChoiceList, TextField, Filters, Card } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { SortableList } from "../SortableList/SortableList";

export function CustomFilters({ items, setItems }) {
  const [availability, setAvailability] = useState<string[]>([]);

  const [queryValue, setQueryValue] = useState("");

  const handleAvailabilityChange = useCallback(
    (value: string[]) => setAvailability(value),
    [],
  );

  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );
  const handleAvailabilityRemove = useCallback(() => setAvailability([]), []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();

    handleQueryValueRemove();
  }, [handleAvailabilityRemove, handleQueryValueRemove]);

  const filters = [
    {
      key: "availability",
      label: "Product Status",
      filter: (
        <ChoiceList
          title="Product Status"
          titleHidden
          choices={[
            { label: "Published", value: "Published" },
            { label: "Unpublished", value: "Unpublished" },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(availability)) {
    const key = "availability";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }

  return (
    <div style={{ height: "auto" }}>
      <Card>
        <Filters
          queryValue={queryValue}
          filters={[]}
          appliedFilters={appliedFilters}
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={handleQueryValueRemove}
          onClearAll={handleFiltersClearAll}
        />
        {/* <DataTable
          columnContentTypes={[
            "text",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
          ]}
          headings={[
            "Product",
            "Price",
            "SKU Number",
            "Net quantity",
            "Net sales",
          ]}
          rows={[
            ["Emerald Silk Gown", "$875.00", 124689, 140, "$122,500.00"],
            ["Mauve Cashmere Scarf", "$230.00", 124533, 83, "$19,090.00"],
            [
              "Navy Merino Wool Blazer with khaki chinos and yellow belt",
              "$445.00",
              124518,
              32,
              "$14,240.00",
            ],
          ]}
          totals={["", "", "", 255, "$155,830.00"]}
        /> */}
        <SortableList items={items} setItems={setItems} />
      </Card>
    </div>
  );

  function disambiguateLabel(key: string, value: string[]): string {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      case "availability":
        return value.join(", ");
      case "productType":
        return value.join(", ");
      default:
        return value.toString();
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
