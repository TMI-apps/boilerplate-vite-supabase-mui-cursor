import { Container, Box, Typography } from "@mui/material";
import { SupabaseCard } from "@/features/setup/components/sections/SupabaseSection";
import { AirtableCard } from "@/features/setup/components/sections/AirtableSection";
import { HostingCard } from "@/features/setup/components/sections/HostingSection";
import { ThemeCard } from "@/features/setup/components/sections/ThemeSection";

export const SetupPage = () => {
  const handleStatusChange = () => {
    // Status change handler for setup cards
    // No state tracking needed since we removed the progress bar
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Configure your app components. All sections are optional - configure what you need and
          skip the rest.
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fit, minmax(280px, 1fr))",
            md: "repeat(auto-fit, minmax(320px, 1fr))",
            lg: "repeat(auto-fit, minmax(350px, 1fr))",
          },
          gap: 3,
          mb: 4,
          justifyContent: "center",
        }}
      >
        <SupabaseCard onStatusChange={handleStatusChange} />
        <AirtableCard onStatusChange={handleStatusChange} />
        <HostingCard onStatusChange={handleStatusChange} />
        <ThemeCard onStatusChange={handleStatusChange} />
      </Box>
    </Container>
  );
};
