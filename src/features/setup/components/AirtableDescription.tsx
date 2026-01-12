import { Alert, Typography } from "@mui/material";

export const AirtableDescription = () => {
  return (
    <>
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter your Airtable credentials below. You should have created your Personal Access Token in
        the previous step.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Where to find your credentials:</strong>
        </Typography>
        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          <strong>Base ID:</strong> Found in your base's API documentation. Access it by going to
          your base → Help → API documentation, or check{" "}
          <Typography
            component="a"
            href="https://support.airtable.com/docs/finding-airtable-ids"
            target="_blank"
            rel="noopener"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            Airtable's guide
          </Typography>
          .
        </Typography>
        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          <strong>Table ID:</strong> The name of your table exactly as it appears in Airtable
          (case-sensitive). For example: "My Table" or "Tasks". You can find all your tables listed
          in your{" "}
          <Typography
            component="a"
            href="https://airtable.com/appcKCfS59kQIIPAW/api/docs"
            target="_blank"
            rel="noopener"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            base's API documentation
          </Typography>
          .
        </Typography>
      </Alert>
    </>
  );
};
