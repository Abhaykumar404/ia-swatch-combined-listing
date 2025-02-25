import {
  BlockStack,
  Card,
  ResourceList,
  Text,
  ResourceItem,
  Avatar,
  Box,
  InlineStack,
  Badge,
  Button,
  IndexTable,
  useIndexResourceState,
  Thumbnail,
  TextField,
  InlineGrid,
  Icon,
  Grid,
} from "@shopify/polaris";
import React from "react";
import { DragHandleIcon, DeleteIcon } from "@shopify/polaris-icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import styles from "./SortableList.module.css";

const DataRows = ({
  id,
  thumbnailSrc,
  thumbailAlt,
  title,
  index,
  selectedResources,
  handleDelete,
  handleChange,
  inputValue,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    ...(transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          transition,
        }
      : {}),
    zIndex: isDragging ? 1000 : 0,
    position: "relative",
    width: "max-content",
    display: "flex",
  };

  console.log("Selected Resource List in ren, ", selectedResources);
  return (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      <IndexTable.Cell>
        <InlineStack gap="200" align="center" as="span">
          {/* Build your own implementation of the ResourceItem, but preserve this drag handle div as the first item in the InlineStack */}
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className={styles.itemAction}
            style={{
              touchAction: "none",
              display: "flex",
              alignItems: "center",
            }} // Prevents page scrolling on mobile touch
          >
            <DragHandleIcon width="20" height="20" />
          </div>
          {/* Don't use `media` prop of ResourceItem, if you need to you can place your Avatar or Image here instead after the DragHandler */}
          <Thumbnail source={thumbnailSrc} alt={thumbailAlt} />
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineGrid gap="100" alignItems="center">
          <Text as="p">{title}</Text>
          <TextField
            placeholder="Enter Value"
            type="text"
            value={inputValue}
            onChange={(new_value) => {
              handleChange(index, new_value);
            }}
          />
        </InlineGrid>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(index);
          }}
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
          }}
        >
          <Icon source={DeleteIcon} tone="critical" />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

const getRows = (items, selectedResources, handleDelete, handleChange) => {
  const rowMarkup = items.map(
    ({ id, thumbailAlt, thumbnailSrc, title, value }, index) => {
      return (
        <DataRows
          key={id}
          id={id}
          thumbailAlt={thumbailAlt}
          thumbnailSrc={thumbnailSrc}
          title={title}
          index={index}
          selectedResources={selectedResources}
          handleDelete={handleDelete}
          inputValue={value}
          handleChange={handleChange}
        />
      );
    },
  );
  return rowMarkup;
};

export const SortableList = ({ items, setItems }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, idx) => idx !== index));
  };

  const handleChange = (index, value) => {
    setItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === index ? { ...item, value: value } : item,
      ),
    );
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Updates items in state, add additional update handler logic here (e.g. API calls, toasts, etc.)
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const updatedItems = arrayMove(items, oldIndex, newIndex);

        return updatedItems;
      });
    }
  };

  //   const promotedBulkActions = [
  //     {
  //       content: <Icon source={DeleteIcon} tone="critical" />,
  //       onAction: () => {
  //         resetItems();
  //       },
  //     },
  //   ];

  const resourceName = {
    singular: "product",
    plural: "products",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(items);

  console.log("Selected Resource List", selectedResources);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <IndexTable
          resourceName={resourceName}
          itemCount={items.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          emptyState
          headings={[{ title: "", hidden: true }]}
        >
          {getRows(items, selectedResources, handleDelete, handleChange)}
        </IndexTable>
      </SortableContext>
    </DndContext>
  );
};
