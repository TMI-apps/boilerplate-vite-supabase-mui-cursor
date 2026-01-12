import { Alert, Typography, Link } from "@mui/material";

export const AirtableDescription = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Choose Base and Table
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" component="div">
          <strong>Base ID:</strong> Found in your base's API documentation (Help → API
          documentation) or in{" "}
          <Link
            href="https://support.airtable.com/docs/finding-airtable-ids"
            target="_blank"
            rel="noopener"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            Airtable's guide
          </Link>
        </Typography>
        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          <strong>Table ID:</strong> The exact name of your table (case-sensitive), e.g., "My Table"
        </Typography>
      </Alert>
    </>
  );
};
