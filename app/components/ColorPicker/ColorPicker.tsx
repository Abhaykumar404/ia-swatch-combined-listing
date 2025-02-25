import {
  ColorPicker,
  TextField,
  Popover,
  FormLayout,
  InlineStack,
  BlockStack,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";

const hsvToHsl = (h, s, v) => {
  // both hsv and hsl values are in [0, 1]
  const l = ((2 - s) * v) / 2;

  if (l !== 0) {
    if (l === 1) {
      s = 0;
    } else if (l < 0.5) {
      s = (s * v) / (l * 2);
    } else {
      s = (s * v) / (2 - l * 2);
    }
  }

  return [h, s, l];
};

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `${f(0)}${f(8)}${f(4)}`;
};

const ColorPickerComponent = ({ label, onChange, currentHexColor }) => {
  const [color, setColor] = useState({
    hue: 120,
    saturation: 1,
    brightness: 1,
    alpha: 1,
  });

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );
  const handleSetColor = (newColor) => {
    setColor(newColor);
    const cc = hsvToHsl(newColor.hue, newColor.saturation, newColor.brightness);
    const hexColorCode = hslToHex(cc[0], cc[1] * 100, cc[2] * 100);
    onChange(hexColorCode);
  };

  const handleHexColorChange = (hexColorCode) => {
    onChange(hexColorCode);
  };

  const activator = (
    <div
      style={{
        height: "30px",
        width: "30px",
        border: "1px solid #d3d3d3",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: `#${currentHexColor}`,
      }}
      onClick={() => {
        console.log("yesh chala");
        togglePopoverActive();
      }}
    />
  );

  return (
    <BlockStack gap={"200"}>
      <Text as="span">{label}</Text>
      <InlineGrid alignItems="start" columns={"2fr auto"} gap={"300"}>
        <Popover
          active={popoverActive}
          activator={activator}
          onClose={togglePopoverActive}
        >
          <ColorPicker onChange={handleSetColor} color={color} />
        </Popover>

        <TextField
          prefix="#"
          value={`${currentHexColor}`}
          onChange={(val) => handleHexColorChange(val)}
          autoComplete="off"
        />
      </InlineGrid>
    </BlockStack>
  );
};

export default ColorPickerComponent;
