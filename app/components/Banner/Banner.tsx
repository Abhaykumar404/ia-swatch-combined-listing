import {
  Text,
  BlockStack,
  Box,
  Banner,
  BannerTone,
  IconSource,
} from "@shopify/polaris";

interface IBanner {
  title: string;
  tone: BannerTone;
  onDismiss: () => void;
  children: React.ReactNode;
  iconSource?: IconSource | undefined;
}
export const CustomBanner: React.FC<IBanner> = ({
  children,
  tone,
  title,
  iconSource,
  onDismiss,
}) => {
  return (
    <Banner
      title={title}
      tone={tone}
      aria-live="polite"
      onDismiss={onDismiss}
      icon={iconSource}
    >
      <Box width="100%">
        <BlockStack align="space-between">{children}</BlockStack>
      </Box>
    </Banner>
  );
};
