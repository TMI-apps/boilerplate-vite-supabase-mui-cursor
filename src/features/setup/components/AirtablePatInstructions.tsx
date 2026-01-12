import { Box, Typography, Alert, Link, TextField } from "@mui/material";

interface AirtablePatInstructionsProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

export const AirtablePatInstructions = ({
  apiKey,
  onApiKeyChange,
}: AirtablePatInstructionsProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create Personal Access Token
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" component="div">
          <strong>Steps:</strong>
        </Typography>
        <Typography variant="body2" component="ol" sx={{ mt: 1, mb: 0, pl: 2 }}>
          <li>
            Go to{" "}
            <Link
              href="https://airtable.com/create/tokens/new"
              target="_blank"
              rel="noopener"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              Airtable's token creation page
            </Link>
          </li>
          <li>
            Select the scopes: <strong>schema.bases:read</strong> and{" "}
            <strong>data.records:read</strong>
          </li>
          <li>Grant access to the base(s) you want to use</li>
          <li>Copy the generated token (starts with 'pat...')</li>
          <li>Paste it in the field below</li>
        </Typography>
      </Alert>

      <TextField
        label="Personal Access Token"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        fullWidth
        type="password"
        placeholder="pat..."
        helperText="Paste your token here"
      />
    </Box>
  );
};
