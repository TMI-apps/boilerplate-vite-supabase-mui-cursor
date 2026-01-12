import { Box, TextField } from "@mui/material";

interface AirtableFormFieldsProps {
  baseId: string;
  tableId: string;
  onBaseIdChange: (value: string) => void;
  onTableIdChange: (value: string) => void;
}

export const AirtableFormFields = ({
  baseId,
  tableId,
  onBaseIdChange,
  onTableIdChange,
}: AirtableFormFieldsProps) => {
  return (
    <Box>
      <TextField
        label="Base ID"
        value={baseId}
        onChange={(e) => onBaseIdChange(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="app..."
      />
      <TextField
        label="Table ID"
        value={tableId}
        onChange={(e) => onTableIdChange(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="My Table"
      />
    </Box>
  );
};
